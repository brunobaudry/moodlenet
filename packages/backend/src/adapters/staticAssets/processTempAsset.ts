import sharp from 'sharp'
import { Readable } from 'stream'
import { TempAssetDesc, TempAssetId, TempFileDesc } from '../../ports/static-assets/types'

export const processTempAsset = ({
  originalAssetStream,
  tempFileDesc,
  tempAssetId,
}: {
  originalAssetStream: Readable
  tempFileDesc: TempFileDesc
  tempAssetId: TempAssetId
}): [Readable, TempAssetDesc] => {
  // console.log({
  //   tempFileDesc,
  //   tempAssetId,
  // })
  const tempAssetDesc = getTempAssetDesc(tempFileDesc, tempAssetId)
  if (tempFileDesc.uploadType === 'resource') {
    return [originalAssetStream, tempAssetDesc]
  }

  const imagePipeline = sharpImagePipeline[tempFileDesc.uploadType]()
  originalAssetStream.pipe(imagePipeline)
  const jpgTmpAssetDesc = getImageTempAssetDesc(tempAssetDesc)
  // console.log({
  //   jpgTmpAssetDesc,
  // })
  return [imagePipeline, jpgTmpAssetDesc]
}

export const getImageTempAssetDesc = (tempAssetDesc: TempAssetDesc) => {
  const jpgTmpAssetDesc: TempAssetDesc = {
    ...tempAssetDesc,
    mimetype: 'image/jpeg',
    filename: {
      ...tempAssetDesc.filename,
      ext: 'jpg',
    },
  }
  return jpgTmpAssetDesc
}

export const getTempAssetDesc = (tempFileDesc: TempFileDesc, tempAssetId: TempAssetId) => {
  const _splitname = !tempFileDesc.name ? null : tempFileDesc.name.split('.')
  const ext = (_splitname && _splitname.pop()) || null
  const originalBaseName = _splitname && _splitname.join('.')

  const tempAssetDesc: TempAssetDesc = {
    tempAssetId,
    filename: {
      base: originalBaseName,
      ext,
    },
    size: tempFileDesc.size,
    mimetype: tempFileDesc.mimetype,
    uploadType: tempFileDesc.uploadType,
    tempFileDesc,
  }
  return tempAssetDesc
}

const sharpImagePipeline = {
  icon: () => sharp({ sequentialRead: true }).resize(256, 256, { fit: 'inside' }).jpeg(),
  image: () => sharp({ sequentialRead: true }).resize(1600, null, { fit: 'cover', withoutEnlargement: true }).jpeg(),
}
