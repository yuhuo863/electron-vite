import { defineStore } from 'pinia'
import category from '@renderer/api/category'
import { ref } from 'vue'
import { AxiosError } from 'axios'
import { ElMessage } from 'element-plus'

export const useCategoryStore = defineStore('category', () => {
  const categoryList = ref<CategoryItem[]>([])

  const fetchCategories = async (): Promise<void> => {
    try {
      const res = await category.getCategoryList()
      categoryList.value = res.data.categories
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.error('Error fetching categories:', error)
        ElMessage.error(error.response?.data?.message || 'Failed to fetch categories')
        throw error
      }
    }
  }

  const createCategory = async (payload): Promise<void> => {
    try {
      await category.createCategory(payload)
      await fetchCategories()
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.error('Error creating category:', error)
        ElMessage.error(error.response?.data?.message || 'Failed to create category')
        throw error
      }
    }
  }

  const updateCategory = async (id: string, payload): Promise<void> => {
    try {
      await category.updateCategory(id, payload)
      await fetchCategories()
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.error('Error updating category:', error)
        ElMessage.error(error.response?.data?.message || 'Failed to update category')
        throw error
      }
    }
  }

  const deleteCategory = async (id: string): Promise<void> => {
    try {
      await category.deleteCategory(id)
      await fetchCategories()
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.error('Error deleting category:', error)
        ElMessage.error(error.response?.data?.message || 'Failed to delete category')
        throw error
      }
    }
  }

  return {
    categoryList,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  }
})
