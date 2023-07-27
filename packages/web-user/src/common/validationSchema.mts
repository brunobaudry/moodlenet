import type { SchemaOf } from 'yup'
import { mixed, object, string } from 'yup'
import type { EditProfileDataRpc } from './expose-def.mjs'

export type ValidationsConfig = { imageMaxUploadSize: number }
export type ValidationSchemas = ReturnType<typeof getValidationSchemas>

export const displayNameSchema = string()
  .max(160)
  .min(3)
  .required(/* t */ `Please provide a display name`)

export function getValidationSchemas({ imageMaxUploadSize }: ValidationsConfig) {
  const avatarImageValidation: SchemaOf<{ image: File | string | undefined | null }> = object({
    image: mixed()
      .test((v, { createError }) => {
        return v instanceof Blob && v.size > imageMaxUploadSize
          ? createError({
              message: `The image file is too big, please reduce the size or use another image`,
            })
          : true
      })
      .optional(),
  })

  const backgroundImageValidation: SchemaOf<{ image: File | string | undefined | null }> = object({
    image: mixed()
      .test((v, { createError }) => {
        return v instanceof Blob && v.size > imageMaxUploadSize
          ? createError({
              message: `The image file is too big, please reduce the size or use another image`,
            })
          : true
      })
      .optional(),
  })

  const profileValidationSchema: SchemaOf<EditProfileDataRpc> = object({
    displayName: displayNameSchema,
    location: string().optional(),
    organizationName: string().max(30).min(3).optional(),
    siteUrl: string().url().optional(),
    aboutMe: string().max(4096).min(3).required(/* t */ `Please provide a description`),
  })

  return {
    displayNameSchema,
    backgroundImageValidation,
    avatarImageValidation,
    profileValidationSchema,
  }
}
