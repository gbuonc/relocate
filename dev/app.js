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
    rooms:['ingresso', 'soggiorno', 'cucina', 'bagno grande', 'bagno piccolo', 'emma', 'leo', 'notte', 'ripostiglio', 'cantina', 'box'],
    destinations:['deposito','casa in affitto','vendita', 'smaltimento'],
    newItem: {isDone: false},
    tempItem: {},
    editToggle: false
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
      app.editToggle = false;
      if (this.isValid) {
        Items.push(this.newItem)
        this.newItem = {}
      }
    },
    editItem: function(i){
        app.tempItem = app.items[i];
        app.editToggle = true;
    },
    saveItem: function(){
        Items.child(app.tempItem.id).update(app.tempItem);
        app.editToggle = false;
        app.tempItem = {};
    },
    removeItem: function () {
        app.editToggle = false;
        new Firebase(baseURL + 'items/' + app.tempItem.id).remove();
        app.tempItem = {};
    },
    markItemDone: function (i) {
        app.tempItem = app.items[i];
        app.tempItem.isDone = !app.tempItem.isDone;
        Items.child(app.tempItem.id).update(app.tempItem);
        app.editToggle = false;
        app.tempItem = {};
    }
  }
});



// EXAMPLES =======================================
// inline css or sass styles on <head>
// require("!style!css!../dist/static/css/app.css");
// require("!style!css!sass!./path/to/file.css");
