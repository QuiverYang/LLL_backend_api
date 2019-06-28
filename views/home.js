const request = require('request');

Vue.component('todo-item',{
    props:['todo'],
    template:'<li>{{todo.text}}</li>'
})

var app = new Vue({ 
    el: '#app',
    data: {
        message: 'Hello Vue!',
        seen:true,
        todos: [
            { text: 'Learn JavaScript' },
            { text: 'Learn Vue' },
            { text: 'Build something awesome' }
          ],
        groceryList:[
            {id:0,text:'Apple'},
            {id:1,text:'Banana'},
            {id:2,text:'Lemon'}
        ]
    },
    methods:
        {
        reverseMsg: function(){
            this.message = this.message.split('').reverse().join('');
        },
        testMsg:function(){
            this.message = 'test';
        }
    }
    
});

app.message = 'BE NEW HELLO!!!';