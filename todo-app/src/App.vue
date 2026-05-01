<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useToast } from "vue-toastification"
import AOS from "aos"
import "aos/dist/aos.css"
const toast = useToast()

const todos = ref([]);
const name = ref("");

const input_content = ref("");
const input_category = ref(null);

const currentFilter = ref("all");

/* ترتيب */
const todos_desc = computed(() =>
  [...todos.value].sort((a, b) => b.createdAt - a.createdAt)
);

/* فلترة */
const filterTodos = computed(() => {
  if (currentFilter.value === "done") {
    return todos_desc.value.filter(t => t.done);
  }
  if (currentFilter.value === "active") {
    return todos_desc.value.filter(t => !t.done);
  }
  return todos_desc.value;
});

/* إضافة */
const addTodo = () => {
  if (!input_content.value.trim() || !input_category.value) {
    toast.error("اكتب المهمة واختار النوع ")
    return
  }

  todos.value.push({
    content: input_content.value,
    category: input_category.value,
    done: false,
    createdAt: Date.now()
  })

  toast.success(" تمت إضافة المهمة!")

  setTimeout(() => {
    AOS.refresh()
  }, 50)

  input_content.value = ""
  input_category.value = null
}

/* حذف */
const removeTodo = (todo) => {
  const confirmDelete = confirm(`هل تريد حذف: ${todo.content} ؟`)

  if (!confirmDelete) return

  todos.value = todos.value.filter(t => t !== todo)

  toast.info(` تم حذف: ${todo.content}`)
}

/* حفظ */
watch(todos, val => {
  localStorage.setItem("todos", JSON.stringify(val));
}, { deep: true });

watch(name, val => {
  localStorage.setItem("name", val);
});

/* تحميل */
onMounted(() => {
  name.value = localStorage.getItem("name") || "";
  todos.value = JSON.parse(localStorage.getItem("todos")) || [];




  AOS.init({
    duration: 800,
    once: true
  })

});
</script>




<template>
  <main class="app">

    <!-- Greeting -->
    <section class="greeting">
      <h2 class="title">
        Whats up,
        <input type="text" placeholder="name here" v-model="name" />
      </h2>
    </section>

    <!-- Create -->
    <section class="create-todo">
      <h3>CREATE A TODO</h3>

      <form @submit.prevent="addTodo">

        <h4>Whats on your todo list?</h4>

        <input
          type="text"
          placeholder="e.g. make a video"
          v-model="input_content"
        />

        <!-- ازرار -->
        <h4>Pick a category</h4>

        <div class="options">
          <button
            type="button"
            :class="['category-btn', { active: input_category === 'business' }]"
            @click="input_category = 'business'"
          >
             Business
          </button>

          <button
            type="button"
            :class="['category-btn', { active: input_category === 'personal' }]"
            @click="input_category = 'personal'"
          >
             Personal
          </button>
        </div>

        <input type="submit" value="Add todo" />

      </form>
    </section>

    <!-- List -->
    <section>
      <h3>TODO LIST</h3>

      <div class="filter">
        <button :class="{active: currentFilter==='all'}" @click="currentFilter='all'">ALL</button>
        <button :class="{active: currentFilter==='done'}" @click="currentFilter='done'">DONE</button>
        <button :class="{active: currentFilter==='active'}" @click="currentFilter='active'">ACTIVE</button>
      </div>

      <div class="list">

        <div
          v-for="todo in filterTodos"
          :key="todo.createdAt"
          :class="['todo-item', { done: todo.done }]"
           data-aos="fade-up"
        >

          <!-- زر التشييك -->
         <label :class="['check-btn', todo.category, { checked: todo.done }]">
            <input type="checkbox" v-model="todo.done" />
            <span class="check-mark">✔</span>
          </label>

          <div class="todo-content">
            <input type="text" v-model="todo.content" />
          </div>

          <div class="actions">
            <button class="delete" @click="removeTodo(todo)">
              Delete
            </button>
          </div>

        </div>

      </div>
    </section>

  </main>
</template>