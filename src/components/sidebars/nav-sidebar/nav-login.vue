<template>
  <section class="nav-login">
    <h3 class="nav-login-title" v-if="$props.projectName">
      <i class="material-icons nav-login-icon">
        lock_open
      </i>
      {{ $props.projectName }}
    </h3>

    <form class="nav-input-form">
      <div class="material-input">
        <input
          v-model="user"
          autocomplete="current-user"
          class="v-input"
          :class="{ 'has-value': user && user.length > 0 }"
          @keypress.13="password && user ? submitLogin() : null"
          placeholder="Username"
          type="text"
          id="name"
        />
      </div>

      <div class="material-input">
        <input
          v-model="password"
          autocomplete="current-password"
          class="v-input"
          :class="{ 'has-value': password && password.length > 0 }"
          @keypress.13="password && user ? submitLogin() : null"
          placeholder="Password"
          type="password"
          id="password"
          name="password"
        />
      </div>
    </form>
    <div class="buttons">
      <v-button
        class="confirm"
        @click="submitLogin()"
        :disabled="!(password && user)"
      >
        {{ confirmText || $t("ok") }}
      </v-button>
      <v-button class="cancel" @click="cancelLogin()">
        {{ cancelText || $t("cancel") }}
      </v-button>
    </div>
  </section>
</template>
<script>
export default {
  props: {
    projectUrl: {
      type: String,
      default: null
    },
    projectName: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      user: this.$store.state.currentUser.email
        ? this.$store.state.currentUser.email
        : "",
      password: "",
      confirmText: "Login",
      cancelText: "Cancel"
    };
  },

  methods: {
    submitLogin() {
      const credentials = {
        url: this.$props.projectUrl,
        email: this.user,
        password: this.password
      };

      return this.$store
        .dispatch("changeAPI", this.$props.projectUrl)
        .then(() => {
          return this.$store
            .dispatch("login", credentials)
            .then(() => {
              this.$router.push("/collections");
              window.location.reload();
            })
            .catch(error => {
              return this.$store.dispatch("switchProject", {
                url: this.$props.projectUrl,
                error
              });
            });
        });
    },

    cancelLogin() {
      return window.location.reload();
    }
  }
};
</script>
<style lang="scss">
.nav-login {
  width: 100%;
  max-width: 100%;
  position: relative;
  overflow: hidden;

  .nav-login-form {
    position: relative;
  }

  .buttons {
    button {
      width: 100%;
      margin-bottom: 10px;
      transition: ease-in-out background-color 0.25s, color 0.15s ease-in-out;

      &:last-of-type {
        margin-bottom: 0;
      }

      &.cancel {
        background-color: var(--lightest-gray);
        color: var(--darker-gray);

        &:hover {
          color: var(--white);
        }
      }
    }
    margin-bottom: 20px;
  }

  .nav-login-icon {
    position: absolute;
    left: 0;
    top: 0;
    font-size: 18px;
    width: 18px;
    height: 18px;
    color: var(--accent);
  }

  .nav-login-title {
    padding-left: 26px;
    font-size: 13px;
    padding-top: 3px;
    color: var(--accent);
  }

  .material-input {
    position: relative;
    width: 100%;
    margin: 10px 20px 10px 0;

    &:last-of-type {
      margin-bottom: 20px;
    }

    input {
      border: 0;
      font-size: 16px;
      border-bottom: 2px solid var(--lighter-gray);
      width: 100%;
      padding: 10px 0;
      color: var(--gray);
      transition: border-color var(--fast) var(--transition);
      border-radius: 0;

      &:-webkit-autofill {
        color: var(--gray) !important;
        -webkit-text-fill-color: var(--gray);
        -webkit-box-shadow: 0 0 0px 1000px var(--white) inset;
      }

      &:hover:not([disabled]) {
        transition: none;
        border-color: var(--gray);
        &:focus {
          border-color: var(--darker-gray);
        }
      }

      &[disabled] {
        cursor: not-allowed;
      }

      &:focus {
        outline: 0;
        border-color: var(--darker-gray);
        color: var(--dark-gray);

        &:-webkit-autofill {
          color: var(--darker-gray) !important;
          -webkit-text-fill-color: var(--darker-gray);
          -webkit-box-shadow: 0 0 0px 1000px var(--white) inset;
        }
      }
    }

    label {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      font-size: 15px;
      font-weight: 400;
      transform-origin: left;
      transition: all var(--fast) var(--transition);
    }

    input:focus,
    input.has-value {
      & + label {
        transform: scale(0.8);
        top: -10px;
      }
    }
  }
}
</style>
