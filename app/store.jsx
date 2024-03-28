import { configureStore } from '@reduxjs/toolkit'
import { apiUrl } from '../features/apiUrl'

export default configureStore({
    
  reducer: {
    apiUrl: apiUrl,
  }
})