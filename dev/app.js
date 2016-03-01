var Firebase = require ('firebase');
var Vue = require ('vue/dist/vue');

// FIREBASE -------------------------------------
var baseURL = 'https://relocate.firebaseio.com/';
var Items = new Firebase(baseURL + 'items');
Items.on('child_added', function(snapshot) {
  var item = snapshot.val();
  item.id = snapshot.key();
  app.items.push(item);
})
Items.on('child_changed', function(snapshot) {
    var item = snapshot.val();
    var id = snapshot.key();
    app.items.some(function(index, item) {
        if (item.id === id) {
            app.items.$set(index, item);
            return true;
        }
    })
})
Items.on('child_removed', function(snapshot) {
    var id = snapshot.key();
  app.items.some(function (item) {
    if (item.id === id) {
      app.items.$remove(item);
      return true
    }
  })
})

// VUE -------------------------------------------
Vue.config.debug = true;
var app = new Vue({
  el: '#app',
  data: {
    items: [],
    newItem: {},
    item:{}
  },
  // computed property for form validation state
  computed: {
    validation: function () {
      return {
        label: !!this.newItem.label.trim()
      }
    },
    isValid: function () {
      var validation = this.validation
      return Object.keys(validation).every(function (key) {
          console.log(validation[key]);
        return validation[key];
      })
    }
  },
  // methods
  methods: {
    addItem: function () {
        console.log(this.newItem);
      if (this.isValid) {
        Items.push(this.newItem)
        this.newItem.label = ''
      }
    },
    editItem: function(){
        console.log(this.item);
            var id = this.id;
            Items.child(id).update(this);
        // item.label = Math.ceil(Math.random(100));
        // Items.child(item.id).update(item);
    },
    removeItem: function (item) {
        new Firebase(baseURL + 'items/' + item.id).remove();
    }
  }
});


	// var filters = {
	// 	all: function (todos) {
	// 		return todos;
	// 	},
	// 	active: function (todos) {
	// 		return todos.filter(function (todo) {
	// 			return !todo.completed;
	// 		});
	// 	},
	// 	completed: function (todos) {
	// 		return todos.filter(function (todo) {
	// 			return todo.completed;
	// 		});
	// 	}
	// };
    //
	// var app = new Vue({
    //
	// 	// the root element that will be compiled
	// 	el: '.todoapp',
    //
	// 	// app initial state
	// 	data: {
	// 		todos: todoStorage.fetch(),
	// 		newTodo: '',
	// 		editedTodo: null,
	// 		visibility: 'all'
	// 	},
    //
	// 	// watch todos change for localStorage persistence
	// 	watch: {
	// 		todos: {
	// 			handler: function (todos) {
	// 			  todoStorage.save(todos);
	// 			},
	// 			deep: true
	// 		}
	// 	},
    //
	// 	// computed properties
	// 	// http://vuejs.org/guide/computed.html
	// 	computed: {
	// 		filteredTodos: function () {
	// 			return filters[this.visibility](this.todos);
	// 		},
	// 		remaining: function () {
	// 			return filters.active(this.todos).length;
	// 		},
	// 		allDone: {
	// 			get: function () {
	// 				return this.remaining === 0;
	// 			},
	// 			set: function (value) {
	// 				this.todos.forEach(function (todo) {
	// 					todo.completed = value;
	// 				});
	// 			}
	// 		}
	// 	},
    //
	// 	// methods that implement data logic.
	// 	// note there's no DOM manipulation here at all.
	// 	methods: {
    //
	// 		addTodo: function () {
	// 			var value = this.newTodo && this.newTodo.trim();
	// 			if (!value) {
	// 				return;
	// 			}
	// 			this.todos.push({ title: value, completed: false });
	// 			this.newTodo = '';
	// 		},
    //
	// 		removeTodo: function (todo) {
	// 			this.todos.$remove(todo);
	// 		},
    //
	// 		editTodo: function (todo) {
	// 			this.beforeEditCache = todo.title;
	// 			this.editedTodo = todo;
	// 		},
    //
	// 		doneEdit: function (todo) {
	// 			if (!this.editedTodo) {
	// 				return;
	// 			}
	// 			this.editedTodo = null;
	// 			todo.title = todo.title.trim();
	// 			if (!todo.title) {
	// 				this.removeTodo(todo);
	// 			}
	// 		},
    //
	// 		cancelEdit: function (todo) {
	// 			this.editedTodo = null;
	// 			todo.title = this.beforeEditCache;
	// 		},
    //
	// 		removeCompleted: function () {
	// 			this.todos = filters.active(this.todos);
	// 		}
	// 	},
    //
	// 	// a custom directive to wait for the DOM to be updated
	// 	// before focusing on the input field.
	// 	// http://vuejs.org/guide/custom-directive.html
	// 	directives: {
	// 		'todo-focus': function (value) {
	// 			if (!value) {
	// 				return;
	// 			}
	// 			var el = this.el;
	// 			Vue.nextTick(function () {
	// 				el.focus();
	// 			});
	// 		}
	// 	}
	// });



// EXAMPLES =======================================
// inline css or sass styles on <head>
// require("!style!css!../dist/static/css/app.css");
// require("!style!css!sass!./path/to/file.css");
