/*
 * 所有的mutations
 */
// 点击打开文件的操作，获取所有文件（磁盘目录），分类文件夹树，智能视图
export const OPEN_FILE = 'openFile'
// 设置节点信息
export const SET_TREE_NODE = 'setTreeNode'
export const TOGGLE_TREE_NODE_DISPLAY = 'toggleTreeNodeDisplay'
// 设置展示的文件列表
export const SET_FILE_LIST = 'setFileList'
// 设置磁盘的文件树数据
export const SET_DISK_FILE_TREE = 'getFileTree'
// 设置回收站数据
export const SET_TRASH = 'setTrash'
// 获取文件详情
export const RECEIVE_FILE_DETAIL = 'receiveFileDetail'
// 设置忽略文件数据
export const SET_IGNORE = 'setIgnore'
// 设置当前的文件树数据
export const SET_CURRENT_FILE_TREE = 'setCurrentFileTree'
// 设置当前路径数据，用于面包屑路径导航
export const SET_CURRENT_PATH = 'setCurrentPath'
// 设置获取的更改文件信息
export const RECEIVE_MODIFIED_FILES = 'receiveModifiedFiles'
// 是否显示文件详情
export const SHOW_FILE_INFO = 'showFileInfo'
// 设置文件所属分类，用于文件详情界面添加文件分类
export const SET_FILE_SORTS = 'setFileSorts'
// 设置文件列表显示状态，用于切换 List，Column，Grid 三种状态
export const SET_FILE_DISPLAY_STATUS = 'setFileDisplayStatus'
// 设置列表区域的拖拽区是否显示
export const TOGGLE_DRAG_SHOW = 'toggleDragShow'
// 添加导入文件
export const ADD_IMPORT_FILES = 'addImportFiles'
// 显示文件更改信息
export const SHOW_MODIFIED_FILE_INFO = 'showModifiedFileInfo'
//
export const ADD_TAGGED_MODIFIED_FILE = 'addTaggedModifiedFile'
//
export const GET_AUTHORS = 'getAuthors'
// 添加分类目录，用于在文件树直接操作
export const ADD_SORT_DIRECTORY = 'addSortDirectory'
// 设置新增智能视图信息
export const SET_NEW_SMART_SORT_INFO = 'setNewSmartSortInfo'
// 设置新增磁盘信息
export const SET_NEW_DISK_DIR_INFO = 'setNewDiskDirInfo'
// 设置新增分类文件夹信息
export const SET_NEW_SORT_DIR_INFO = 'setNewSortDirInfo'
// 向后台请求搜索条件
export const GET_SEARCH_CONDITIONS = 'getSearchConditions'
// 临时用来显示添加的智能视图
export const ADD_SMART_SORT = 'addSmartSort'
// 显示所有的智能视图
export const SHOW_SMART_SORT_LIST = 'showSmartSortList'
// 显示单个具体的智能视图样式
export const SHOW_SMART_SORT = 'showSmartSort'
// 处理后台返回的搜索条件
export const HANDLE_SEARCH_CONDITION_MAP = 'handleConditionMap'
// 重置智能视图里面的内容
export const SET_SMART_SORT = 'setSmartSort'
export const DELETE_LIST = 'deleteList'
// 设置搜索位置
export const SET_SEARCH_RANGE = 'setSearchRange'
// 设置 Excel 导入目标磁盘信息
export const SET_IMPORT_TARGET_DISKS = 'setImportTargetDisks'
export const CHANGE_MODIFIED_FILES_TREE_NODE = 'changeModifiedFilesTreeNode'
export const SET_NODE_DATA = 'setNodeData'
export const RENEW_NODE_DATA = 'renewNodeData'
export const REMOVE_TAGGED_FILE = 'removeTaggedFile'
export const SET_SHOW_MODE = 'setShowMode'
export const SET_SELECTED_FILES_NUM = 'setSelectedFilesNum'
export const IGNORE_FILES = 'ignoreFiles'
