export const fastqTemplate = {
  'filetype': 'fastq',
  'sample': {
    'id': '样本编号',
    'name': '样本名',
    'organism': '物种',
    'strain': '品种',
    'tissue': '组织',
    'sex': '性别',
    'age': '年龄',
    'development_stage': '发育阶段',
    'breeding_history': '育种史',
    'biomaterial_provider': '材料提供者',
    'geographic_location': '地理位置',
    'treatment': '处理方式',
    'replicate': '生物学重复',
    'generation': '世代'
  },
  'library': {
    'instrument': '测序平台',
    'strategy': '建库策略',
    'read_length': '读长',
    'source': '组学分类',
    'selection': '模版类型',
    'layout': '单/双端'
  },
  'fastq': {
    'sequence_counts': '序列数',
    'qualities_options': '质量信息编码方式'
  }
}

export const wtfTemplate = {
  'filetype': 'wtf',
  'attr1': {
    'some': '111',
    'thing': '222'
  },
  'attr2': {
    'oh': '333',
    'interesting': '444'
  }
}
