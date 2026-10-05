<template>
  <q-page class="study-page">
    <div class="app-shell">
      <section class="hero">
        <div>
          <div class="eyebrow">Laravel + Vue 3 + Quasar • Activity 2</div>
          <h1>StudyQuest</h1>
          <p class="subtitle">Assignment tracker connected to a Laravel API and MySQL database.</p>
        </div>

        <div class="hero-actions">
          <q-btn
            outline
            no-caps
            color="white"
            :icon="darkMode ? 'light_mode' : 'dark_mode'"
            :label="darkMode ? 'Light Mode' : 'Dark Mode'"
            @click="toggleDarkMode"
          />
          <q-btn
            unelevated
            no-caps
            color="white"
            text-color="primary"
            icon="cable"
            label="Test Backend"
            :loading="testingApi"
            @click="testApi"
          />
        </div>
      </section>

      <q-banner v-if="apiMessage" rounded class="api-banner">
        <template #avatar>
          <q-icon name="check_circle" color="positive" />
        </template>
        <strong>Laravel API:</strong> {{ apiMessage }}
      </q-banner>

      <section class="panel add-panel">
        <div class="section-heading">
          <div>
            <h2>Add Assignment</h2>
            <p>Create a task and save it directly to MySQL.</p>
          </div>
          <q-badge rounded outline color="primary" :label="`${totalTasks} total`" />
        </div>

        <q-form class="task-form" @submit.prevent="addTask">
          <q-input
            v-model.trim="newTask.name"
            outlined
            label="Assignment"
            placeholder="Example: Quasar Activity"
            lazy-rules
            :rules="[(value) => !!value || 'Assignment is required']"
          />

          <q-input
            v-model.trim="newTask.subject"
            outlined
            label="Subject"
            placeholder="Example: IT Elective 4"
            lazy-rules
            :rules="[(value) => !!value || 'Subject is required']"
          />

          <q-select
            v-model="newTask.priority"
            outlined
            label="Priority"
            :options="priorityOptions"
          />

          <q-btn
            unelevated
            no-caps
            color="primary"
            icon="add"
            label="Add Task"
            type="submit"
            :loading="saving"
          />
        </q-form>
      </section>

      <section class="stats-grid">
        <q-card flat bordered class="stat-card">
          <q-card-section>
            <span class="stat-label">Total Tasks</span>
            <strong>{{ totalTasks }}</strong>
          </q-card-section>
        </q-card>
        <q-card flat bordered class="stat-card">
          <q-card-section>
            <span class="stat-label">Completed</span>
            <strong>{{ completedCount }}</strong>
          </q-card-section>
        </q-card>
        <q-card flat bordered class="stat-card">
          <q-card-section>
            <span class="stat-label">Pending</span>
            <strong>{{ pendingCount }}</strong>
          </q-card-section>
        </q-card>
        <q-card flat bordered class="stat-card">
          <q-card-section>
            <span class="stat-label">Progress</span>
            <strong>{{ progressPercentage }}%</strong>
          </q-card-section>
        </q-card>
      </section>

      <section class="panel">
        <div class="controls">
          <q-input
            v-model.trim="searchText"
            outlined
            dense
            class="search-field"
            label="Search"
            placeholder="Search assignment or subject..."
          >
            <template #prepend><q-icon name="search" /></template>
          </q-input>

          <q-btn-toggle
            v-model="currentFilter"
            no-caps
            unelevated
            toggle-color="primary"
            color="grey-2"
            text-color="dark"
            :options="filterOptions"
          />
        </div>

        <div class="progress-wrap">
          <div class="progress-info">
            <span>Overall progress</span>
            <span>{{ completedCount }} / {{ totalTasks }} complete</span>
          </div>
          <q-linear-progress rounded size="11px" :value="progressValue" color="primary" track-color="grey-3" />
        </div>

        <div v-if="loading" class="loading-state">
          <q-spinner-dots color="primary" size="48px" />
          <p>Loading assignments from Laravel...</p>
        </div>

        <div v-else-if="filteredTasks.length" class="task-grid">
          <q-card
            v-for="task in filteredTasks"
            :key="task.id"
            flat
            bordered
            :class="['task-card', { done: task.completed }]"
          >
            <q-card-section>
              <div class="task-top">
                <div>
                  <p class="subject">{{ task.subject }}</p>
                  <h3>{{ task.name }}</h3>
                </div>
                <q-badge
                  rounded
                  :color="priorityColor(task.priority)"
                  :label="task.priority"
                />
              </div>

              <div class="status-row">
                <q-chip
                  dense
                  :color="task.completed ? 'positive' : task.priority === 'High' ? 'negative' : 'grey-4'"
                  :text-color="task.completed || task.priority === 'High' ? 'white' : 'dark'"
                  :icon="task.completed ? 'check_circle' : 'schedule'"
                >
                  {{ task.completed ? 'Completed' : task.priority === 'High' ? 'High Priority' : 'Pending' }}
                </q-chip>
              </div>

              <div class="task-actions">
                <q-btn
                  unelevated
                  no-caps
                  color="primary"
                  :icon="task.completed ? 'undo' : 'done'"
                  :label="task.completed ? 'Mark Pending' : 'Complete'"
                  @click="toggleTask(task)"
                />
                <q-btn
                  outline
                  no-caps
                  color="negative"
                  icon="delete"
                  label="Delete"
                  @click="removeTask(task)"
                />
              </div>
            </q-card-section>
          </q-card>
        </div>

        <div v-else class="empty-state">
          <q-icon name="menu_book" size="54px" color="primary" />
          <h3>No tasks found</h3>
          <p v-if="searchText">No assignment matches “{{ searchText }}”.</p>
          <p v-else-if="currentFilter === 'Completed'">You do not have completed tasks yet.</p>
          <p v-else-if="currentFilter === 'Pending'">Great job! You do not have pending tasks.</p>
          <p v-else>Add your first assignment above.</p>
        </div>
      </section>

      <footer>StudyQuest • Laravel + Vue 3 + Quasar + MySQL</footer>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import axios from 'axios'
import { Dark, Dialog, Notify } from 'quasar'

interface Assignment {
  id: number
  name: string
  subject: string
  priority: 'Low' | 'Medium' | 'High'
  completed: boolean
  created_at?: string
  updated_at?: string
}

const tasks = ref<Assignment[]>([])
const searchText = ref('')
const currentFilter = ref<'All' | 'Pending' | 'Completed'>('All')
const apiMessage = ref('')
const loading = ref(false)
const saving = ref(false)
const testingApi = ref(false)
const darkMode = ref(Dark.isActive)

const newTask = reactive({
  name: '',
  subject: '',
  priority: 'Medium' as Assignment['priority'],
})

const priorityOptions: Assignment['priority'][] = ['Low', 'Medium', 'High']
const filterOptions = [
  { label: 'All', value: 'All' },
  { label: 'Pending', value: 'Pending' },
  { label: 'Completed', value: 'Completed' },
]

const totalTasks = computed(() => tasks.value.length)
const completedCount = computed(() => tasks.value.filter((task) => task.completed).length)
const pendingCount = computed(() => tasks.value.filter((task) => !task.completed).length)
const progressPercentage = computed(() => totalTasks.value === 0 ? 0 : Math.round((completedCount.value / totalTasks.value) * 100))
const progressValue = computed(() => progressPercentage.value / 100)

const filteredTasks = computed(() => {
  const query = searchText.value.toLowerCase()

  return tasks.value.filter((task) => {
    const matchesSearch = task.name.toLowerCase().includes(query) || task.subject.toLowerCase().includes(query)
    const matchesFilter = currentFilter.value === 'All'
      || (currentFilter.value === 'Completed' && task.completed)
      || (currentFilter.value === 'Pending' && !task.completed)

    return matchesSearch && matchesFilter
  })
})

function priorityColor(priority: Assignment['priority']) {
  if (priority === 'High') return 'negative'
  if (priority === 'Medium') return 'warning'
  return 'positive'
}

async function loadTasks() {
  loading.value = true
  try {
    const response = await axios.get<Assignment[]>('/api/assignments')
    tasks.value = response.data
  } catch (error) {
    console.error(error)
    Notify.create({ type: 'negative', message: 'Could not load assignments. Make sure Laravel and MySQL are running.' })
  } finally {
    loading.value = false
  }
}

async function testApi() {
  testingApi.value = true
  try {
    const response = await axios.get<{ message: string }>('/api/hello')
    apiMessage.value = response.data.message
    Notify.create({ type: 'positive', message: 'Backend connection successful!' })
  } catch (error) {
    console.error(error)
    Notify.create({ type: 'negative', message: 'Backend connection failed. Start Laravel on port 8000.' })
  } finally {
    testingApi.value = false
  }
}

async function addTask() {
  if (!newTask.name || !newTask.subject) return

  saving.value = true
  try {
    const response = await axios.post<Assignment>('/api/assignments', {
      name: newTask.name,
      subject: newTask.subject,
      priority: newTask.priority,
      completed: false,
    })

    tasks.value.unshift(response.data)
    newTask.name = ''
    newTask.subject = ''
    newTask.priority = 'Medium'
    Notify.create({ type: 'positive', message: 'Assignment saved to MySQL.' })
  } catch (error) {
    console.error(error)
    Notify.create({ type: 'negative', message: 'Could not save the assignment.' })
  } finally {
    saving.value = false
  }
}

async function toggleTask(task: Assignment) {
  try {
    const response = await axios.patch<Assignment>(`/api/assignments/${task.id}`, {
      completed: !task.completed,
    })
    Object.assign(task, response.data)
  } catch (error) {
    console.error(error)
    Notify.create({ type: 'negative', message: 'Could not update the assignment.' })
  }
}

function removeTask(task: Assignment) {
  Dialog.create({
    title: 'Delete Assignment',
    message: `Delete “${task.name}”?`,
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    try {
      await axios.delete(`/api/assignments/${task.id}`)
      tasks.value = tasks.value.filter((item) => item.id !== task.id)
      Notify.create({ type: 'positive', message: 'Assignment deleted.' })
    } catch (error) {
      console.error(error)
      Notify.create({ type: 'negative', message: 'Could not delete the assignment.' })
    }
  })
}

function toggleDarkMode() {
  darkMode.value = !darkMode.value
  Dark.set(darkMode.value)
  localStorage.setItem('studyquest-dark', String(darkMode.value))
}

onMounted(() => {
  const savedDark = localStorage.getItem('studyquest-dark')
  if (savedDark !== null) {
    darkMode.value = savedDark === 'true'
    Dark.set(darkMode.value)
  }
  loadTasks()
})
</script>
