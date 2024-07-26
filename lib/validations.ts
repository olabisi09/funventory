import * as Yup from 'yup'

export const validateSale = Yup.object().shape({
  product: Yup.number().min(1).required('Product is required'),
  qtySold: Yup.number().positive('Quantity must be a positive number').required('Quantity is required'),
  saleDate: Yup.string().required('Date is required'),
})