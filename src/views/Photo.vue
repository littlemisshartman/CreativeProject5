<template>
<div class="image" v-if="photo">
    <h2 class="photoTitle">{{photo.title}}</h2>
    <img :src="photo.path" />
    <p class="photoDate">
        <span v-if="photo.user && photo.user.name">{{photo.user.name}}, </span>
        {{formatDate(photo.created)}} 
    </p>
    <p>{{photo.description}}</p>
    <div>
    <p></p>
    <h3>Comments</h3>
    <p v-if="comments.length === 0">No comments</p>

    <div class="image" v-for="comment in comments" v-bind:key="comment._id">
        <p class="commentText">{{ comment.text }}</p>
        <p class="photoDate">
        <span v-if="comment.user.name">{{comment.user.name}}, </span>
        {{formatDate(comment.created)}}
        </p>
    </div>
    <p></p>
    <p></p>
    <form v-if="user" @submit.prevent="addComment">
        <h3>Add a comment</h3>
        <input v-model="newComment" placeholder="Comment">
        <p></p>
        <button type="submit" class="pure-button pure-button-secondary">Submit</button>
    </form>
    </div>
</div>

</template>


<script>
import moment from 'moment';

export default {
    name: 'photo',
    data: function () {
        return {
            newComment: "",
            error: "",
        }
    },
    async created () {
        console.log(this.$route.params);
        await this.$store.dispatch("getUser");
        await this.$store.dispatch("getMyPhoto", this.$route.params.id);
        await this.$store.dispatch("getMyComment", this.$route.params.id);
    },
    methods: {
        formatDate(date) {
            if (moment(date).diff(Date.now(), 'days') < 15)
                return moment(date).fromNow();
            else
                return moment(date).format('d MMMM YYYY');
        },
        async addComment() {
            try {
                if (this.user && this.photo) {
                    if (this.newComment) {
                        this.error = await this.$store.dispatch("addComment", {
                            user: this.user,
                            photo: this.photo,
                            text: this.newComment
                        });
                        this.newComment = "";
                        await this.$store.dispatch("getMyComment", this.$route.params.id);
                    }
                }
            } catch (error) {
                console.log(error);
            } 
        }
    },
    computed: {
        comments: function () {
            return this.$store.state.comments;
        },
        user() {
            return this.$store.state.user;
        },
        photo() {
            //console.log(this.$store.state.photo);
            return this.$store.state.photo;
        },
    },
}
</script>