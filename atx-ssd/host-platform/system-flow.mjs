import { hostSteps } from './model.mjs';

export const signalKinds = {
  command:{title:'命令 / 门铃',color:'#f1bd77'},
  data:{title:'4 KiB 数据',color:'#70e5bb'},
  completion:{title:'16 B CQE',color:'#99befa'},
  notice:{title:'中断 / 轮询',color:'#d7b2f8'},
  media:{title:'SSD 内部处理',color:'#f0cb8e'},
};

export function hostWriteTarget(step) {
  return step.id==='data-mwr'?'buffer':step.id==='cqe'?'cq':null;
}

const locations = {
  cpu:'CPU 与主机内存',link:'CPU 直连 M2_1',transfer:'整机 · 主机内存 ↔ SSD',
  pascal:'990 PRO · Pascal 剖视',drive:'990 PRO · 板内总线',nand:'990 PRO · NAND A 剖视',
};

const brief = (id,title,bus,text,path,focus,change={}) => ({
  id,title,bus,text,path,focus,change,kind:'media',location:locations[focus],
  refs:['flash'],
});

export function systemSteps(operation, irq='irq') {
  const steps=new Map(hostSteps(operation,irq).map(step=>[step.id,step]));
  const read=operation==='read';
  const fromHost=(id,focus,kind,path,extra={})=>({
    ...steps.get(id),focus,kind,path,location:locations[focus],...extra,
  });
  const stepsToCommand=[
    fromHost('submit','transfer','command',['cpu']),
    fromHost('map','cpu','command',['cpu','iommu'],{
      text:read?'驱动为读结果准备一个 4 KiB 对齐页，建立设备可用的 DMA 地址，并把它填入 PRP1。':
        '驱动在主机缓冲区准备 4 KiB 数据并完成 DMA 映射。PRP1 指向 SSD 读取负载时使用的设备地址。',
    }),
    fromHost('sqe','cpu','command',['cpu','umc','sq']),
    fromHost('doorbell','link','command',['cpu','root','pcie-down','endpoint'],{
      text:'CPU 发布 SQ[3] 的 64 B 命令后，把新的队尾值 0 写到 BAR0 + 0x1008。32 位门铃写经过 IOD 根端口与 M2_1，抵达 Pascal 的 NVMe 前端。',
    }),
    fromHost('sq-mrd','transfer','command',['dma','endpoint','pcie-up','root','iommu','umc','sq']),
    fromHost('sq-cpl','transfer','command',['sq','umc','root','pcie-down','endpoint','dma']),
  ];
  const ftl=read
    ? brief('ftl','Pascal 找到逻辑块对应的闪存页','SQE → FTL / SRAM',
      '控制器解码读命令，查询闪存映射。本例选择 NAND A 的一个示例页。上层 4 KiB 范围由 LBA 和 NLB 描述，物理页由 FTL 决定。',
      ['dma','ftl','sram'],'pascal',{media:'NAND A · 已定位示例页'})
    : brief('ftl','Pascal 为写入分配闪存页','4 KiB 写负载 → FTL / SRAM',
      '写负载先进入控制器工作缓冲。FTL 为本次写入安排新页，准备逻辑到物理映射的更新。',
      ['sram','ftl'],'pascal',{media:'NAND A · 已分配示例页'});
  const reading=[
    ftl,
    brief('nand-command','Pascal 向 NAND A 发送读页命令','NAND DQ · 命令与行 / 列地址',
      'NAND PHY 通过板内总线送命令和地址。剖视依次点亮 NAND 的 I/O 接口、行地址锁存和块与字线译码。',
      ['nand-phy','nand-down','nand-io','addr','row'],'drive'),
    brief('wordline','选中串组与字线','行译码 → SGD / SGS → WL',
      '行译码选择块及目标字线，串选择栅接通对应的 NAND 串。选中的字线使用读取所需的参考偏置。',
      ['row','select','wordline'],'nand'),
    brief('sense','位线感测单元状态','WL → BL → 感测放大器',
      '位线把被选串的响应送到感测放大器。TLC 逻辑页可需要多组参考阈值，本例展示其中的感测路径。',
      ['wordline','bitline','sense'],'nand'),
    brief('page','把感测结果锁存进页缓冲','Sense amp → Page buffer',
      '并行感测结果先写入 NAND 的页缓冲。由列选择在页缓冲中定位随后要输出的字节。',
      ['sense','page'],'nand',{media:'NAND 页缓冲 · 已锁存'}),
    brief('nand-out','经列选择把数据送回 Pascal','NAND → Pascal · DQ / DQS',
      'NAND 将页缓冲中的选定区间经列复用与 I/O 输出给主控。读的数据和读选通由 NAND 驱动。',
      ['page','column','nand-io','nand-up','nand-phy'],'drive'),
    brief('ecc','主控完成 ECC 并交给 DMA','NAND PHY → ECC → SRAM → DMA',
      'Pascal 采样 NAND 数据，执行 ECC 解码，然后把数据交给 DMA。具体编码与重试策略由设备实现决定。',
      ['nand-phy','ecc','sram','dma'],'pascal',{media:'Pascal · 读数据已就绪'}),
    fromHost('data-mwr','transfer','data',['dma','endpoint','pcie-up','root','iommu','umc','buffer'],{
      title:'读数据单独写回主机数据页',
      text:'SSD 按 PRP1 将总计 4 KiB 负载以 posted MWr 送回主机内存域。绿色路径终止于数据缓冲区。此步 CQ[3] 仍保留旧相位。',
    }),
  ];
  const writing=[
    fromHost('data-mrd','transfer','data',['dma','endpoint','pcie-up','root','iommu','umc','buffer']),
    fromHost('data-cpl','transfer','data',['buffer','umc','root','pcie-down','endpoint','dma','sram']),
    ftl,
    brief('ecc-encode','Pascal 编码写入数据','SRAM → ECC → NAND PHY',
      '控制器给待写入数据生成纠错冗余，再把数据和冗余交给 NAND 后端。',
      ['sram','ecc','nand-phy'],'pascal'),
    brief('nand-load','把写数据装入 NAND 页缓冲','Pascal → NAND · DQ / DQS',
      '主控驱动数据与写选通。NAND I/O 按列地址把数据和纠错冗余装入页缓冲。',
      ['nand-phy','nand-down','nand-io','column','page'],'drive',{media:'NAND 页缓冲 · 已装载'}),
    {...brief('program','用页缓冲驱动选中的单元编程','Page buffer → BL · 选中字线编程偏置',
      '页缓冲控制各位线的编程或禁止条件。选中字线经历编程脉冲，单元的阈值随存入电荷发生改变。',
      ['page','bitline','select'],'nand',{media:'NAND A · 编程中'}),mark:['wordline']},
    brief('verify','感测阈值并检查编程状态','Program verify · WL / BL / Sense',
      'NAND 在编程过程中交替执行脉冲与验证，检查目标状态是否达到。这里跟踪一次成功路径。',
      ['wordline','bitline','sense'],'nand',{media:'NAND A · 编程验证通过'}),
    fromHost('media','drive','media',['nand-io','nand-up','nand-phy','ftl','dma'],{
      title:'满足 FUA 持久条件后准备报完成',
      text:'主控取得 NAND 的成功状态并完成本次映射的持久化要求。示例 Write 的 FUA=1，数据及相关元数据满足非易失保存条件后，才报告成功。',
      change:{...steps.get('media').change,media:'NAND A · FUA 写已满足持久性'},
      refs:['nvmeBase','flash'],
    }),
  ];
  const afterMedia=[
    fromHost('cqe','transfer','completion',['dma','endpoint','pcie-up','root','iommu','umc','cq'],{
      title:'完成项另写入主机 CQ[3]',
      text:'蓝色路径终止于 CQ[3]。SSD 发布 16 B CQE，含 SQID=1、SQHD=0、CID=0x002A、P=1 与成功状态。数据页与队列项各有独立的目标地址。',
    }),
    irq==='irq'
      ? fromHost('irq','link','notice',['endpoint','pcie-up','root','irq-target','cpu'])
      : fromHost('poll','cpu','notice',['cpu','umc','cq']),
    fromHost('consume','cpu','completion',['cq','umc','cpu']),
    fromHost('cq-db','link','command',['cpu','root','pcie-down','endpoint']),
  ];
  return [...stepsToCommand,...(read?reading:writing),...afterMedia];
}
