import { defineStore } from 'pinia'

export const useExampleStore = defineStore('example', {
  state: () => ({
    projectName: 'StudyQuest',
  }),
})
