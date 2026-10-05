const { createApp } = Vue;

createApp({
  // REQUIRED: data()
  data() {
    return {
      newTask: {
        name: '',
        subject: '',
        priority: 'Medium'
      },

      tasks: [
        {
          id: 1,
          name: 'Finish Vue.js Activity',
          subject: 'Web Development',
          priority: 'High',
          completed: false
        },
        {
          id: 2,
          name: 'Review Algebra Notes',
          subject: 'Mathematics',
          priority: 'Medium',
          completed: true
        },
        {
          id: 3,
          name: 'Read Chapter 5',
          subject: 'English',
          priority: 'Low',
          completed: false
        }
      ],

      searchText: '',
      currentFilter: 'All',
      filterOptions: ['All', 'Pending', 'Completed'],
      message: '',
      darkMode: false
    };
  },

  // REQUIRED: computed properties
  computed: {
    totalTasks() {
      return this.tasks.length;
    },

    completedCount() {
      return this.tasks.filter(task => task.completed).length;
    },

    pendingCount() {
      return this.tasks.filter(task => !task.completed).length;
    },

    progressPercentage() {
      if (this.totalTasks === 0) return 0;
      return Math.round((this.completedCount / this.totalTasks) * 100);
    },

    filteredTasks() {
      const query = this.searchText.toLowerCase();

      return this.tasks.filter(task => {
        const matchesSearch =
          task.name.toLowerCase().includes(query) ||
          task.subject.toLowerCase().includes(query);

        const matchesFilter =
          this.currentFilter === 'All' ||
          (this.currentFilter === 'Completed' && task.completed) ||
          (this.currentFilter === 'Pending' && !task.completed);

        return matchesSearch && matchesFilter;
      });
    }
  },

  // REQUIRED: methods
  methods: {
    addTask() {
      if (!this.newTask.name || !this.newTask.subject) {
        this.showMessage('Please complete the assignment and subject fields.');
        return;
      }

      this.tasks.unshift({
        id: Date.now(),
        name: this.newTask.name,
        subject: this.newTask.subject,
        priority: this.newTask.priority,
        completed: false
      });

      this.newTask = {
        name: '',
        subject: '',
        priority: 'Medium'
      };

      this.saveTasks();
      this.showMessage('Task added successfully!');
    },

    removeTask(id) {
      this.tasks = this.tasks.filter(task => task.id !== id);
      this.saveTasks();
      this.showMessage('Task removed.');
    },

    toggleTask(id) {
      const task = this.tasks.find(task => task.id === id);

      if (task) {
        task.completed = !task.completed;
        this.saveTasks();
      }
    },

    saveTasks() {
      localStorage.setItem('studyQuestTasks', JSON.stringify(this.tasks));
    },

    loadTasks() {
      const savedTasks = localStorage.getItem('studyQuestTasks');

      if (savedTasks) {
        this.tasks = JSON.parse(savedTasks);
      }

      const savedTheme = localStorage.getItem('studyQuestDarkMode');
      this.darkMode = savedTheme === 'true';
      this.applyTheme();
    },

    toggleDarkMode() {
      this.darkMode = !this.darkMode;
      localStorage.setItem('studyQuestDarkMode', this.darkMode);
      this.applyTheme();
    },

    applyTheme() {
      document.body.classList.toggle('dark-mode', this.darkMode);
    },

    showMessage(text) {
      this.message = text;

      setTimeout(() => {
        this.message = '';
      }, 2200);
    }
  },

  mounted() {
    this.loadTasks();
  }
}).mount('#app');
