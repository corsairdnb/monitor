export function CommentsApp (data) {
  return new Vue({
    el: '#app-comments',
    template: '#app-comments-template',
    data () {
      return {
        title: 'vue app',
        comments: []
      }
    },
    methods: {
      updated: (data) => {
        console.log('update:')
        console.log(data)
      }
    }
  })
}
