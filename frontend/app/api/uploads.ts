import { pathsUploads } from "../lib/types/types"

export const fetchPreview = async (formData: FormData) => {
  const token = localStorage.getItem('token')
  const type:	pathsUploads = "preview"

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_ROUTE_PREVIEW}${type}`, {
    method: 'POST',
    headers: {
      authorization: token ? `Bearer ${token}` : "",
    },
    body: formData
  })
  const resJson = res.json()

  return resJson
}

export const fetchFiles = async (formData: FormData) => {
  const token = localStorage.getItem('token')
  const type:	pathsUploads = "files"

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_ROUTE_FILE}${type}`, {
    method: 'POST',
    headers: {
      authorization: token ? `Bearer ${token}` : "",
    },
    body: formData
  })
  const resJson = res.json()

  return resJson
}