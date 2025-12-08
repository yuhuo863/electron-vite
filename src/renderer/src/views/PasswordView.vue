<script setup lang="ts">
import password from '@renderer/api/password'
import Pagination from '@renderer/components/Pagination.vue'
import { useCategoryStore } from '@renderer/stores/category'
import { usePwdStore } from '@renderer/stores/password'
import { useDebounceFn } from '@vueuse/core'
import { ElMessage, FormInstance, FormRules } from 'element-plus'
import { computed, reactive, ref, useTemplateRef } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const pwdStore = usePwdStore()
const searchPassword = ref('')
const currentSort = ref('createdAt-DESC')
const handleSearch = async (keyword: string): Promise<void> => {
  if (!keyword) return
  pwdStore.currentPage = 1
  const [sortBy, sortOrder] = currentSort.value.split('-')
  await pwdStore.getPasswordList({
    search: keyword || undefined,
    categoryId: selectedCategoryId.value || undefined,
    sortBy: sortBy || 'createdAt',
    sortOrder: (sortOrder as 'DESC' | 'ASC') || 'DESC'
  })
}

const debounceHandleSearch = useDebounceFn(handleSearch, 200)

const getDataByQuery = async (isFavorite?: boolean): Promise<void> => {
  const [sortBy, sortOrder] = currentSort.value.split('-')
  await pwdStore.getPasswordList({
    categoryId: selectedCategoryId.value || undefined,
    search: searchPassword.value || undefined,
    sortBy: sortBy || 'createdAt',
    sortOrder: (sortOrder as 'DESC' | 'ASC') || 'DESC',
    isFavorite
  })
}

const currentFavorite = ref<boolean>()
const handleQuery = async (command: string): Promise<void> => {
  switch (command) {
    case 'all':
      currentFavorite.value = undefined
      await getDataByQuery()
      break
    case 'favorite':
      currentFavorite.value = true
      await getDataByQuery(currentFavorite.value)
      break
  }
}

const selectedCategoryId = ref('')
const handleFilter = async (categoryId: string): Promise<void> => {
  selectedCategoryId.value = categoryId === 'all' ? '' : categoryId
  pwdStore.currentPage = 1
  if (currentFavorite.value) {
    await getDataByQuery(currentFavorite.value)
  } else {
    await getDataByQuery()
  }
}

const categoryStore = useCategoryStore()
const currentCategoryLabel = computed(() => {
  const category = categoryStore.categoryList.find((c) => c.id === selectedCategoryId.value)
  return category ? category.name : '全部分类'
})

const handleSort = async (command: string): Promise<void> => {
  currentSort.value = command
  if (currentFavorite.value) {
    await getDataByQuery(currentFavorite.value)
  } else {
    await getDataByQuery()
  }
}

const currentSortLabel = computed(() => {
  const [field, direction] = currentSort.value.split('-')
  const fieldMap = {
    createdAt: '创建时间',
    updatedAt: '更新时间',
    title: '名称'
  }
  const directionMap = {
    DESC: '倒序',
    ASC: '正序'
  }
  return `${fieldMap[field] || '默认'} (${directionMap[direction] || ''})`
})

const togglePasswordVisibility = (item): void => {
  item.showPassword = !item.showPassword
}
const toggleFavorite = async (item): Promise<void> => {
  if (item) {
    await pwdStore.toggleFavorite(item.id)
    ElMessage.success(`${item.title} ${item.isFavorite ? '取消收藏' : '收藏成功'}`)
  }
}
const debounceToggleFavorite = useDebounceFn(toggleFavorite, 200)

const isEditMode = ref(false)
const drawerFormEl = useTemplateRef<FormInstance | null>('drawerFormEl')
const drawerForm = ref({
  id: '',
  title: '',
  username: '',
  password: '',
  url: '',
  notes: ''
})
const rules = reactive<FormRules<PasswordForm>>({
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  url: [{ required: false }],
  notes: [{ required: false }]
})
const drawerVisible = ref(false)
const currentCategoryId = ref('')
const openDrawer = async (passwordItem): Promise<void> => {
  if (passwordItem) {
    isEditMode.value = true
    drawerForm.value = { ...passwordItem }
    currentCategoryId.value = passwordItem.category.id
  } else {
    isEditMode.value = false
    drawerForm.value = {
      id: '',
      title: '',
      username: '',
      password: '',
      url: '',
      notes: ''
    }
    currentCategoryId.value = ''
  }
  drawerVisible.value = true
}

const deletePassword = async (id: string): Promise<void> => {
  try {
    await pwdStore.deletePassword(id)
    ElMessage.success('已移入回收站')
  } catch (error) {
    ElMessage.error('移入回收站失败')
    console.error(error)
  }
}

const copyUsername = (username: string): void => {
  navigator.clipboard
    .writeText(username)
    .then(() => {
      ElMessage.success('复制成功')
    })
    .catch(() => {
      ElMessage.error('复制失败')
    })
}

const handleCurrentChange = async (val: number): Promise<void> => {
  pwdStore.currentPage = val
  if (currentFavorite.value) {
    await getDataByQuery(currentFavorite.value)
  } else {
    await getDataByQuery()
  }
}

const handleSubmit = (formEl: FormInstance | null): void => {
  if (!formEl) return
  formEl.validate(async (valid) => {
    if (valid) {
      try {
        if (isEditMode.value) {
          await pwdStore.updatePassword(drawerForm.value.id, {
            ...drawerForm.value,
            categoryId: currentCategoryId.value
          })
          ElMessage.success('更新成功')
        } else {
          await pwdStore.createPassword(drawerForm.value)
          ElMessage.success('创建成功')
        }
      } catch (error) {
        ElMessage.error('保存失败')
        console.error(error)
      } finally {
        drawerVisible.value = false
      }
    }
  })
}

const handleViewDetail = async (id: string): Promise<void> => {
  try {
    await password.getPasswordDetail(id)
    router.push({ path: `/password/${id}` })
  } catch (error) {
    ElMessage.error('获取详情失败')
    console.error(error)
  }
}
const debounceViewDetail = useDebounceFn(handleViewDetail, 300)
</script>

<template>
  <div>
    <div class="flex justify-between">
      <div class="flex-1 mr-1">
        <el-input
          v-model="searchPassword"
          clearable
          placeholder="搜索密码..."
          @change="handleSearch"
        >
          <template #prepend>
            <el-button icon="Search" @click="debounceHandleSearch(searchPassword)" />
          </template>
        </el-input>
      </div>
      <div class="ml1">
        <el-dropdown trigger="click" @command="handleQuery">
          <el-button>
            <el-icon><Select /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item icon="Shop" command="all">全部</el-dropdown-item>
              <el-dropdown-item icon="StarFilled" command="favorite">收藏</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
      <div class="ml1">
        <el-dropdown trigger="click" @command="handleFilter">
          <el-button>
            <el-icon><Filter /></el-icon>
            {{ currentCategoryLabel }}
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="all">全部分类</el-dropdown-item>
              <el-dropdown-item
                v-for="category in categoryStore.categoryList"
                :key="category.id"
                :command="category.id"
              >
                {{ category.name }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>

      <div class="ml1">
        <el-dropdown trigger="click" @command="handleSort">
          <el-button>
            <el-icon><Sort /></el-icon>
            {{ currentSortLabel }}
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="createdAt-DESC">创建时间 (倒序)</el-dropdown-item>
              <el-dropdown-item command="createdAt-ASC">创建时间 (正序)</el-dropdown-item>
              <el-dropdown-item command="updatedAt-DESC">更新时间 (倒序)</el-dropdown-item>
              <el-dropdown-item command="updatedAt-ASC">更新时间 (正序)</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>

    <div v-if="pwdStore.passwordList.length === 0">
      <el-empty description="暂无密码" />
    </div>

    <div v-else>
      <el-row :gutter="20">
        <el-col
          v-for="item in pwdStore.passwordList"
          :key="item.id"
          :xs="24"
          :sm="12"
          :md="8"
          :lg="6"
        >
          <el-card
            class="my-4 cursor-pointer hover:bg-gray-100"
            shadow="never"
            @click="debounceViewDetail(item.id)"
          >
            <template #header>
              <div class="flex items-center space-x-2">
                <el-icon :size="28" color="skyblue">
                  <component :is="item.category.icon"></component>
                </el-icon>
                <div>
                  <p class="text-sm font-bold truncate w-18">
                    {{ item.title }}
                  </p>
                  <p class="text-xs text-gray-500">{{ item.category.name }}</p>
                </div>
              </div>

              <div class="flex">
                <div @click.stop="debounceToggleFavorite(item)">
                  <el-button
                    v-if="item.isFavorite"
                    text
                    icon="StarFilled"
                    class="is-active"
                    size="small"
                  ></el-button>
                  <el-button v-else text icon="Star" size="small"></el-button>
                </div>
                <div>
                  <el-button
                    text
                    icon="Edit"
                    size="small"
                    @click.stop="openDrawer(item)"
                  ></el-button>
                </div>
                <div>
                  <el-button
                    text
                    icon="Delete"
                    size="small"
                    @click.stop="deletePassword(item.id)"
                  ></el-button>
                </div>
              </div>
            </template>
            <!-- card body -->
            <div class="flex flex-col">
              <div>
                <label class="text-gray-400 text-sm">用户名</label>
                <div class="flex justify-between">
                  <p class="text-xs">{{ item.username }}</p>
                  <p
                    class="text-xs text-gray-400 cursor-pointer hover:text-gray-600"
                    @click.stop="copyUsername(item.username)"
                  >
                    <el-icon>
                      <CopyDocument />
                    </el-icon>
                  </p>
                </div>
              </div>
              <div>
                <label class="text-gray-400 text-sm">密码</label>
                <div class="flex justify-between">
                  <p class="text-sm">
                    {{ item?.showPassword ? item.password : '********' }}
                  </p>
                  <p
                    class="text-xs text-gray-400 cursor-pointer hover:text-gray-600"
                    @click.stop="togglePasswordVisibility(item)"
                  >
                    <el-icon>
                      <component :is="item?.showPassword ? 'Hide' : 'View'" />
                    </el-icon>
                  </p>
                </div>
              </div>
            </div>

            <template #footer>
              <div class="flex justify-end">
                <p class="text-xs text-gray-400">
                  上次使用:{{ item.lastUsed ? item.lastUsed : 'Never' }}
                </p>
              </div>
            </template>
          </el-card>
        </el-col>
      </el-row>
      <div class="flex justify-center">
        <Pagination
          :total="pwdStore.total"
          :current-page="pwdStore.currentPage"
          :page-size="pwdStore.pageSize"
          @current-change="handleCurrentChange"
        />
      </div>
      <el-drawer
        v-model="drawerVisible"
        :title="isEditMode ? '编辑密码' : '新建密码'"
        direction="rtl"
        size="40%"
        :destroy-on-close="true"
        :resizable="true"
      >
        <el-form
          ref="drawerFormEl"
          :model="drawerForm"
          :rules="rules"
          label-position="top"
          label-width="auto"
          :show-message="false"
        >
          <el-form-item label="分类">
            <el-select v-model="currentCategoryId" placeholder="默认分类" clearable>
              <el-option
                v-for="category in categoryStore.categoryList"
                :key="category.id"
                :label="category.name"
                :value="category.id"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="名称" prop="title">
            <el-input v-model="drawerForm.title" />
          </el-form-item>

          <el-form-item label="用户名" prop="username">
            <el-input v-model="drawerForm.username" />
          </el-form-item>

          <el-form-item label="密码" prop="password">
            <el-input v-model="drawerForm.password" show-password> </el-input>
          </el-form-item>

          <el-form-item label="URL" prop="url">
            <el-input v-model="drawerForm.url" />
          </el-form-item>

          <el-form-item label="备注" prop="notes">
            <el-input v-model="drawerForm.notes" type="textarea" />
          </el-form-item>
        </el-form>
        <template #footer>
          <div class="drawer-footer">
            <el-button @click="drawerVisible = false">取消</el-button>
            <el-button type="primary" @click="handleSubmit(drawerFormEl)">
              {{ isEditMode ? '更新' : '提交' }}
            </el-button>
          </div>
        </template>
      </el-drawer>
    </div>
  </div>
</template>

<style lang="css" scoped>
:deep(.el-card__header) {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 12px 20px;
}
.is-active {
  color: gold;
}
</style>
