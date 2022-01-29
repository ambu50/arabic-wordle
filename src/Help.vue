<script setup lang="ts">
import { LetterState } from './types'

 /* const props = defineProps({
    help: Boolean
  })*/
  const emit = defineEmits(['help'])
  const board1 = $ref(
  Array.from({ length: 1 }, () =>
    [
      {letter: 'ك',state: LetterState.CORRECT},
      {letter: 'ل',state: LetterState.INITIAL},
      {letter: 'م',state: LetterState.INITIAL},
      {letter: 'ا',state: LetterState.INITIAL},
      {letter: 'ت',state: LetterState.INITIAL},]
  )
)
const board2 = $ref(
  Array.from({ length: 1 }, () =>
    [
      {letter: 'ك',state: LetterState.INITIAL},
      {letter: 'ل',state: LetterState.INITIAL},
      {letter: 'م',state: LetterState.PRESENT},
      {letter: 'ا',state: LetterState.INITIAL},
      {letter: 'ت',state: LetterState.INITIAL},]
  )
)
const board3 = $ref(
  Array.from({ length: 1 }, () =>
    [
      {letter: 'ك',state: LetterState.INITIAL},
      {letter: 'ل',state: LetterState.INITIAL},
      {letter: 'م',state: LetterState.INITIAL},
      {letter: 'ا',state: LetterState.INITIAL},
      {letter: 'ت',state: LetterState.ABSENT},]
  )
)

const example1 = "كلمات".split('');
  function close(){
    emit('help');
    console.log('emmiting');
  }


</script>

<template>
  <div id="Help">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">

          <div class="modal-header">
            <slot name="header">
              <button class="modal-default-button" @click="close">
                X
              </button>
              
              <h2> طريقة اللعب </h2>
            </slot>
          </div>

          <div class="modal-body">
            <slot name="body">
              خمن اللعبة في ستة محاولات. <br>
              كل تخمين يجب ان يكون كلمة خماسية صحيحية. إضغط على زر إدخال لاعتماد التخمين. <br>
              بعد كل تخمين لون المربعات سيتغير ليظهر مدى اقترابك من الحل. <br>
              <hr>
              <h3> أمثلة </h3>
              <div class="board">
                <div
                  v-for="(row, index) in board1"
                  :class="[
                    'row']"
                >
                  <div
                    v-for="(tile, index) in row"
                    :class="['tile', tile.letter && 'filled', tile.state && 'revealed']"
                  >
                    <div class="front" :style="{ transitionDelay: `${index * 300}ms` }">
                      {{ tile.letter }}
                    </div>
                    <div
                      :class="['back', tile.state]"
                      :style="{
                        transitionDelay: `${index * 300}ms`,
                        animationDelay: `${index * 100}ms`
                      }"
                    >
                      {{ tile.letter }}
                    </div>
                  </div>
                </div>
                <p style="margin-top: 20px">الحرف ك موجود في الكلمة وهو في المكان الصحيح</p>
              </div>
              <div class="board">
                <div
                  v-for="(row, index) in board2"
                  :class="[
                    'row']"
                >
                  <div
                    v-for="(tile, index) in row"
                    :class="['tile', tile.letter && 'filled', tile.state && 'revealed']"
                  >
                    <div class="front" :style="{ transitionDelay: `${index * 300}ms` }">
                      {{ tile.letter }}
                    </div>
                    <div
                      :class="['back', tile.state]"
                      :style="{
                        transitionDelay: `${index * 300}ms`,
                        animationDelay: `${index * 100}ms`
                      }"
                    >
                      {{ tile.letter }}
                    </div>
                  </div>
                </div>
                <p style="margin-top: 20px">الحرف <strong> م</strong> موجود في الكلمة لكن في المكان الخاطيئ</p>
              </div>
              <div class="board">
                <div
                  v-for="(row, index) in board3"
                  :class="[
                    'row']"
                >
                  <div
                    v-for="(tile, index) in row"
                    :class="['tile', tile.letter && 'filled', tile.state && 'revealed']"
                  >
                    <div class="front" :style="{ transitionDelay: `${index * 300}ms` }">
                      {{ tile.letter }}
                    </div>
                    <div
                      :class="['back', tile.state]"
                      :style="{
                        transitionDelay: `${index * 300}ms`,
                        animationDelay: `${index * 100}ms`
                      }"
                    >
                      {{ tile.letter }}
                    </div>
                  </div>
                </div>
                <p style="margin-top: 20px">الحرف <strong> ت</strong> ليس موجود في الكلمة فعليك عدم اختياره مرة أخرى</p>
              </div>
              
            </slot>
          </div>

          <div class="modal-footer">
            <slot name="footer">
              <div style=" direction: rtl;">
              تطوير: أحمد بوخمسين @techi50
              </div>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.board {
  display: grid;
  grid-template-rows: repeat(1, 1fr);
  box-sizing: border-box;
  height: 90px;
  width: 200px;
  margin: 0px auto;
  margin-bottom: 20px;
}
.row {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-gap: 5px;
}
.tile {
  width: 100%;
  font-size: 1.5rem;
  line-height: 2rem;
  font-weight: bold;
  vertical-align: middle;
  text-transform: uppercase;
  user-select: none;
  position: relative;
}
.tile.filled {
  animation: zoom 0.2s;
}
.tile .front,
.tile .back {
  box-sizing: border-box;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transition: transform 0.6s;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}
.tile .front {
  border: 2px solid #d3d6da;
}
.tile.filled .front {
  border-color: #999;
}
.tile .back {
  transform: rotateX(180deg);
}
.tile.revealed .front {
  transform: rotateX(180deg);
}
.tile.revealed .back {
  transform: rotateX(0deg);
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
  width: 90%;
  height: 90%;
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
