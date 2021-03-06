import request from '@/utils/request'

// 获取表格列表
export function getList (url, params, formParams) {
  return request({
    url: `${url}page=${params.page}&page_limit=${params.limit}&${formParams}`,
    method: 'get',
  })
}

// 导出Excel
export function exportExcel (url) {
  return request({
    url: url,
    method: 'get',
  })
}