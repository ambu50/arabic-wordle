<script setup lang="ts">
import { ref } from 'vue'

    const emit = defineEmits(['yourword'])
    let word = ref("");
    let url = ref("");
    function close(){
        emit('yourword');
        console.log('emmiting');
    }
    let message = $ref('')
    function showMessage(msg: string, time = 1000) {
        message = msg
        if (time > 0) {
            setTimeout(() => {
            message = ''
            }, time)
        }
     }

    function copyToClipboard(){
        navigator.clipboard.writeText(url.value);
    }

    function b64EncodeUnicode(str: string) {
        // first we use encodeURIComponent to get percent-encoded UTF-8,
        // then we convert the percent encodings into raw bytes which
        // can be fed into btoa.
        return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
            function toSolidBytes(match, p1) {
                return String.fromCharCode('0x' + p1);
        }));
    }
    function createYourWord(str: string){
        let URL = location.protocol + '//' + location.host + location.pathname + "?" + b64EncodeUnicode(str);
        url.value = URL;
    }
    function typeing(){
        if(word.value.length == 5){
            createYourWord(word.value)
        }else if(word.value.length > 5){
            showMessage("يجب أن تحتوي الكلمة على خمس حروف")
        }else if(word.value.length <5){
            url.value = "";
        }
    }

</script>

<template>
  <Transition>
    <div class="message" v-if="message">
      {{ message }}
    </div>
  </Transition>
  <div id="YourWord">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">

          <div class="modal-header">
            <slot name="header">
              <button class="modal-default-button" @click="close">
                X
              </button>
              
              <h2> اكتب كلمة ثم تحدى اللآخرين بمشاركتهم الرابط </h2>
            </slot>
          </div>

          <div class="modal-body">
            <div class="row">
                <div class="flex md12">
                    <div class="item">
                        <va-input
                        class="mb-4"
                        @keyup="typeing"
                        v-model="word"
                        placeholder="أكتب كلمة مكونة من خمسة أحرف"
                        />
                    </div>
                </div>
            </div>
            <div v-if="word.length == 5" class="row">
                <div class="flex md9">
                    <va-input style="width: 600px;direction: ltr"
                    class="mb-4"
                    v-model="url" 
                    placeholder="سيظهر الرابط هنا"
                    />
                </div>
                <div class="flex md3">
                    <va-button v-on:click="copyToClipboard"> نسخ </va-button>
                </div>
            </div>
          </div>

          <div class="modal-footer">
            <slot name="footer">
              
            </slot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.va-button__content {
  color: white !important;
}
.message {
  position: absolute;
  left: 50%;
  top: 80px;
  color: #fff;
  background-color: rgba(0, 0, 0, 0.85);
  padding: 16px 20px;
  z-index: 9999;
  border-radius: 4px;
  transform: translateX(-50%);
  transition: opacity 0.3s ease-out;
  font-weight: 600;
}
.message.v-leave-to {
  opacity: 0;
}
    .va-input--labeled{
        text-align: right;
    }
    @keyframes zoom {
    0% {
        transform: scale(1.1);
    }
    100% {
        transform: scale(1);
    }
    }

    .shake {
    animation: shake 0.5s;
    }

    @keyframes shake {
    0% {
        transform: translate(1px);
    }
    10% {
        transform: translate(-2px);
    }
    20% {
        transform: translate(2px);
    }
    30% {
        transform: translate(-2px);
    }
    40% {
        transform: translate(2px);
    }
    50% {
        transform: translate(-2px);
    }
    60% {
        transform: translate(2px);
    }
    70% {
        transform: translate(-2px);
    }
    80% {
        transform: translate(2px);
    }
    90% {
        transform: translate(-2px);
    }
    100% {
        transform: translate(1px);
    }
    }

    .jump .tile .back {
    animation: jump 0.5s;
    }

    @keyframes jump {
    0% {
        transform: translateY(0px);
    }
    20% {
        transform: translateY(5px);
    }
    60% {
        transform: translateY(-25px);
    }
    90% {
        transform: translateY(3px);
    }
    100% {
        transform: translateY(0px);
    }
    }

    @media (max-height: 680px) {
    .tile {
        font-size: 3vh;
    }
    }

    #app {
    padding: 1rem;
    }

    .modal-mask {
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: table;
    }

    .modal-wrapper {
    display: table-cell;
    vertical-align: middle;
    }

    .modal-container {
    width: 70%;
    height: 40%;
    margin: 0px auto;
    padding: 20px 30px;
    background-color: #fff;
    border-radius: 2px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
    font-family: Helvetica, Arial, sans-serif;
    overflow: scroll;
    }

    .modal-header h3 {
    margin-top: 0;
    color: #42b983;
    }

    .modal-body {
    margin: 20px 0;
    direction: rtl;
    overflow: scroll;
    }

    h3{
    text-align: center;
    }

    .modal-default-button {
    float: right;
    }

    /*
    * The following styles are auto-applied to elements with
    * transition="modal" when their visibility is toggled
    * by Vue.js.
    *
    * You can easily play with the modal transition by editing
    * these styles.
    */

    .modal-enter-active,
    .modal-leave-active {
    transition: opacity 0.5s ease;
    }

    .modal-enter-from,
    .modal-leave-to {
    opacity: 0;
    }

</style>
