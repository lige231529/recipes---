function _upload(filepaths){
  let pss=[] //存放每个文件上传返回的promise
  filepaths.forEach(item=>{
    let filenames = item.url.split('.')
    let t = new Date()
    let newname = '' + t.getTime() + '-' + Math.random().toString().substring(2,8) + '.' + filenames[filenames.length - 1]
  let ps =   wx.cloud.uploadFile({
      filePath:item.url,
      cloudPath:newname
    })
     pss.push(ps)
  })
  return Promise.all(pss)
}
export {_upload}