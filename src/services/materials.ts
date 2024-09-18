import axios from 'axios';

const baseUrl = 'http://localhost:3006/api/materials';

export interface IMaterial {
  id: string
  image: string | Blob
  name: string
  description: string
  brand: string
  category: string
  stock: number
  cost: number
}

interface IMaterialResponse {
  data: IMaterial[]
}

interface IDeleteResponse {
  message: string
}

const getAll = async (): Promise<IMaterial[]> => {
  const response = await axios.get<IMaterialResponse>(baseUrl)
  return response.data.data
}

const create = async (formData: FormData): Promise<IMaterial> => {
  const response = await axios.post<IMaterial>(baseUrl, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response.data
}

const update = async (id: string, newObject: IMaterial): Promise<IMaterial> => {
  const formData = new FormData();
  (Object.keys(newObject) as Array<keyof IMaterial>).forEach(key => {
    const value = newObject[key];
    if (value !== undefined) {
      if (key === 'image' && value instanceof Blob) { 
        formData.append(key, value, 'image.jpg')
      } else {
        formData.append(key, value.toString())
      }
    }
  })
  const response = await axios.put<IMaterial>(`${baseUrl}/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response.data
}

const remove = async (id: string): Promise<IDeleteResponse> => {
  const response = await axios.delete<IDeleteResponse>(`${baseUrl}/${id}`);
  return response.data
}

export default { getAll, create, update, remove }
