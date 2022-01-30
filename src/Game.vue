<script setup lang="ts">
import Vue from "vue";
import { onUnmounted } from "vue";
import { getWordOfTheDay, allWords } from "./words";
import Keyboard from "./Keyboard.vue";
import { LetterState } from "./types";
import Help from "./Help.vue";
import YourWord from "./YourWord.vue";
import { ref } from "vue";
//import { getCurrentInstance } from 'vue'

//const app = getCurrentInstance()
//const window = app?.appContext.config.globalProperties['window'];
let yourword = ref(false);
const today = "كلمة اليوم";
const choose = "اختر كلمتك";
const random = "كلمة عشوائية";
const myurl = window.location.href;
const twitter_str = "قمت بتخمين كلمة اليوم بنجاح في لعبة wordle العربية";
let mode = ref(today);
let answer = getWord();
let help = ref(false);
const white = "#FFFFFF";
const black = "#000000";
// Board state. Each tile is represented as { letter, state }
const board = $ref(
  Array.from({ length: 6 }, () =>
    Array.from({ length: 5 }, () => ({
      letter: "",
      state: LetterState.INITIAL,
    }))
  )
);

// Current active row.
let currentRowIndex = $ref(0);
const currentRow = $computed(() => board[currentRowIndex]);

// Feedback state: message and shake
let message = $ref("");
let grid = $ref("");
let shakeRowIndex = $ref(-1);
let success = $ref(false);

// Keep track of revealed letters for the virtual keyboard
const letterStates: Record<string, LetterState> = $ref({});

// Handle keyboard input.
let allowInput = ref(true);

const onKeyup = (e: KeyboardEvent) => onKey(e.key);

window.addEventListener("keyup", onKeyup);

onUnmounted(() => {
  window.removeEventListener("keyup", onKeyup);
});

function getWord() {
  if (location.search) {
    console.log("seerch");
    const param = location.search.slice(1);
    if (param.startsWith("word=")) {
      console.log("word");
      if (!Number.isNaN(Number(param.split("word=")[1]))) {
        console.log("get word number " + param.split("word=")[1]);
        mode.value = random;
        return getWordOfTheDay(Number(param.split("word=")[1]));
      } else {
        window.location.href = window.location.pathname;
      }
    } else {
      try {
        const query = b64DecodeUnicode(location.search.slice(1));
        if (query.length !== 5) {
          //reload to base
          window.location.href = window.location.pathname;
        } else {
          mode.value = choose;
          return query;
        }
      } catch (e) {
        window.location.href = window.location.pathname;
      }
    }
  } else {
    return getWordOfTheDay(-1);
  }
}

function onKey(key: string) {
  if (!allowInput.value) return;
  if (/^[\u0621-\u064A]$/.test(key)) {
    console.log("accepted letter");
    fillTile(key.toLowerCase());
  } else if (key === "Backspace") {
    clearTile();
  } else if (key === "إدخال") {
    completeRow();
  }
}

function fillTile(letter: string) {
  for (const tile of [...currentRow].reverse()) {
    if (!tile.letter) {
      tile.letter = letter;
      break;
    }
  }
}

function clearTile() {
  for (const tile of currentRow) {
    if (tile.letter) {
      tile.letter = "";
      break;
    }
  }
}

function reverseString(str: string): string {
  return str === "" ? "" : reverseString(str.substr(1)) + str.charAt(0);
}

function completeRow() {
  console.log("enter pressed");
  if (currentRow.every((tile) => tile.letter)) {
    const guess = reverseString(currentRow.map((tile) => tile.letter).join(""));
    if (!allWords.includes(guess) && guess !== answer) {
      shake();
      showMessage(`كلمة غير موجودة`);
      return;
    }

    const answerLetters: (string | null)[] = answer.split("");
    // first pass: mark correct ones
    currentRow.reverse().forEach((tile, i) => {
      if (answerLetters[i] === tile.letter) {
        tile.state = letterStates[tile.letter] = LetterState.CORRECT;
        answerLetters[i] = null;
      }
    });
    // second pass: mark the present
    currentRow.reverse().forEach((tile) => {
      if (!tile.state && answerLetters.includes(tile.letter)) {
        tile.state = LetterState.PRESENT;
        answerLetters[answerLetters.indexOf(tile.letter)] = null;
        if (!letterStates[tile.letter]) {
          letterStates[tile.letter] = LetterState.PRESENT;
        }
      }
    });
    // 3rd pass: mark absent
    currentRow.reverse().forEach((tile) => {
      if (!tile.state) {
        tile.state = LetterState.ABSENT;
        if (!letterStates[tile.letter]) {
          letterStates[tile.letter] = LetterState.ABSENT;
        }
      }
    });

    allowInput.value = false;
    if (currentRow.reverse().every((tile) => tile.state === LetterState.CORRECT)) {
      // yay!
      setTimeout(() => {
        grid = "\n" + genResultGrid() + "\n";
        showMessage(
          ["عبقري", "مذهل", "رائع", "أحسنت", "عظيم", "أخيرًا"][currentRowIndex],
          -1
        );
        success = true;
      }, 1600);
    } else if (currentRowIndex < board.length - 1) {
      // go the next row
      currentRowIndex++;
      setTimeout(() => {
        allowInput.value = true;
      }, 1600);
    } else {
      // game over :(
      /*setTimeout(() => {
        showMessage(answer.toUpperCase(), -1)
      }, 1600)*/
    }
  } else {
    shake();
    showMessage("الحروف المدخلة غير كافية");
  }
}

function showMessage(msg: string, time = 1000) {
  message = msg;
  if (time > 0) {
    setTimeout(() => {
      message = "";
    }, time);
  }
}

function shake() {
  shakeRowIndex = currentRowIndex;
  setTimeout(() => {
    shakeRowIndex = -1;
  }, 1000);
}

const icons = {
  [LetterState.CORRECT]: "🟩",
  [LetterState.PRESENT]: "🟨",
  [LetterState.ABSENT]: "⬜",
  [LetterState.INITIAL]: null,
};

function genResultGrid() {
  return board
    .slice(0, currentRowIndex + 1)
    .map((row) => {
      return row.map((tile) => icons[tile.state]).join("");
    })
    .join("\n");
}
function close_help() {
  help.value = false;
}
function close_yourword() {
  yourword.value = false;
  allowInput.value = true;
}
function b64DecodeUnicode(str: string) {
  // Going backwards: from bytestream, to percent-encoding, to original string.
  return decodeURIComponent(
    atob(str)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );
}
function randomMode() {
  mode.value = random;
  const number = Math.round(Math.random() * 100000000) % 12000;
  let URL = window.location.pathname + "?word=" + number;
  window.location.href = URL;
}
function todayMode() {
  mode.value = today;
  window.location.href = window.location.pathname;
}
</script>

<template>
  <Transition>
    <div class="message" v-if="message">
      <p>{{ message }}</p>
      <div v-if="grid">
        <br />
        <pre>{{ grid }}</pre>

        <ShareNetwork
          network="twitter"
          :url="myurl"
          :title="twitter_str+grid"
          hashtags="wordle,arabic"
        >
        <br>
        شارك نتيجتك عبر تويتر <font-awesome-icon :icon="{ prefix: 'fab', iconName: 'twitter' }" />
        
        </ShareNetwork>
      </div>
    </div>
  </Transition>
  <header>
    <ul>
      <li style="padding-top: 22px">
        <va-icon v-on:click="help = true" color="#FFFFFF" name="help_outline" />
      </li>
      <li style="font-size: 20px; padding-top: 25px">{{ mode }} - Wordle بالعربي</li>
      <li>
        <va-button-dropdown color="#FFFFFF" icon="settings">
          <va-list>
            <va-list-item v-on:click="todayMode">
              <va-list-item-section>
                <va-list-item-label>
                  {{ today }}
                </va-list-item-label>
              </va-list-item-section>
            </va-list-item>
            <va-list-item
              v-on:click="
                mode = choose;
                yourword = true;
                allowInput = false;
              "
            >
              <va-list-item-section>
                <va-list-item-label>
                  {{ choose }}
                </va-list-item-label>
              </va-list-item-section>
            </va-list-item>
            <va-list-item v-on:click="randomMode">
              <va-list-item-section>
                <va-list-item-label>
                  {{ random }}
                </va-list-item-label>
              </va-list-item-section>
            </va-list-item>
          </va-list>
        </va-button-dropdown>
      </li>
    </ul>
    <hr />
    <va-divider> </va-divider>
  </header>

  <div id="board">
    <div
      v-for="(row, index) in board"
      :class="[
        'row',
        shakeRowIndex === index && 'shake',
        success && currentRowIndex === index && 'jump',
      ]"
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
            animationDelay: `${index * 100}ms`,
          }"
        >
          {{ tile.letter }}
        </div>
      </div>
    </div>
  </div>
  <Keyboard @key="onKey" :letter-states="letterStates" />
  <Help v-if="help" @help="close_help" />
  <YourWord v-if="yourword" @yourword="close_yourword" />
</template>
<style>
.share-network-twitter{
  color: white;
  direction: rtl;
  text-align: right;
}
i {
  color: black !important;
}
.va-button__content {
  color: black !important;
}
.va-button--small .va-button__content {
  padding: 0px !important;
}
</style>

<style scoped>
.va-list-item-label:hover {
  background-color: lightgray;
}
.va-list-item-label {
  padding: 5px;
}
button {
  all: unset;
  cursor: pointer;
}

button:focus {
  outline: orange 5px auto;
}
ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
  overflow: hidden;
  display: flex;
  justify-content: center;
}

li {
  color: black;
  padding: 16px;
}
#board {
  display: grid;
  grid-template-rows: repeat(6, 1fr);
  grid-gap: 5px;
  padding: 10px;
  box-sizing: border-box;
  --height: min(420px, calc(var(--vh, 100vh) - 310px));
  height: var(--height);
  width: min(350px, calc(var(--height) / 6 * 5));
  margin: 0px auto;
}
.message {
  position: absolute;
  left: 50%;
  top: 80px;
  color: #fff;
  background-color: rgba(0, 0, 0, 0.85);
  padding: 16px 20px;
  z-index: 2;
  border-radius: 4px;
  transform: translateX(-50%);
  transition: opacity 0.3s ease-out;
  font-weight: 600;
}
.message.v-leave-to {
  opacity: 0;
}
.row {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-gap: 5px;
}
.tile {
  width: 100%;
  font-size: 2rem;
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
</style>
