<template>
  <v-container>
    <v-dialog
            v-model="registerDialog"
            persistent
            max-width="600px"
    >
      <v-card>
        <v-card-title>
          <span class="headline">User Registration</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col>
                <v-text-field label="User Name" v-model="userName"></v-text-field>
                <v-text-field label="User Password" v-model="userPassword"></v-text-field>
                <v-text-field label="User Confirm Password" v-model="userPasswordConfirmation"></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
                  color="blue darken-1"
                  text
                  @click="registerDialog=false"
          >
            Close
          </v-btn>
          <v-btn
                  color="blue darken-1"
                  text
                  @click="registerUser()"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
            v-model="loginDialog"
            persistent
            max-width="600px"
    >
      <v-card>
        <v-card-title>
          <span class="headline">User Login</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col>
                <v-text-field label="User Name" v-model="userName"></v-text-field>
                <v-text-field label="User Password" v-model="userPassword"></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
                  color="blue darken-1"
                  text
                  @click="loginDialog=false"
          >
            Close
          </v-btn>
          <v-btn
                  color="blue darken-1"
                  text
                  @click="loginUser()"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>


    <v-row v-for="item in items" class="text-center">
      <v-col>
        <v-btn :to="item.href">
          {{item.text}}
        </v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <div class="home">
          <!-- Check that the SDK client is not currently loading before accessing is methods -->
          <v-btn v-if="!isAuthenticated" @click="showLogin()">Log in</v-btn>
          <v-btn v-if="!isAuthenticated" @click="showRegister()">Register</v-btn>
          <!-- show logout when authenticated -->
          <v-btn v-if="isAuthenticated" @click="logout">Log out</v-btn>
        </div>
      </v-col>
    </v-row>

    <v-snackbar
            v-model="snackbar"
    >
      {{ snackbarText }}

      <template v-slot:action="{ attrs }">
        <v-btn
                color="pink"
                text
                v-bind="attrs"
                @click="snackbar = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script>
  export default {
    name: 'HelloWorld',

    data: () => ({
      items: [
        {
          text: 'Crear un libro nuevo',
          href: '/book/new',
        },
        {
          text: 'Mis libros',
          href: '/user/library',
        }
      ],
      registerDialog: false,
      loginDialog: false,
      userName: '',
      userPassword: '',
      userPasswordConfirmation: '',
      userThumb: '',
      snackbar: false,
      snackbarText: ''
    }),
    methods: {
      loginUser() {
        const vm = this;

        const data = {
          name: this.userName,
          password: this.userPassword
        };

        this.$store.dispatch('login', data).then(function(registerData) {
          if (!vm.isAuthenticated) {
            vm.snackbarText = registerData;
            vm.snackbar = true;
          }
          vm.loginDialog = false;
        }).catch(function(err) {
          vm.snackbarText = err.toString();
          vm.snackbar = true;
        })
      },
      registerUser() {
        const vm = this;
        if (vm.userName === '') {
          vm.snackbarText = 'el nombre de usuario esta vacio';
          vm.snackbar = true;
          return
        }

        if (vm.userPassword !== vm.userPasswordConfirmation) {
          vm.snackbarText = 'La contrasenia no machea';
          vm.snackbar = true;
          return
        }

        if (vm.userPassword === '') {
          vm.snackbarText = 'la contrasenia no puede ser vacia';
          vm.snackbar = true;
          return
        }

        const data = {
          name: this.userName,
          password: this.userPassword,
          thumb: this.userThumb
        };
        this.$store.dispatch('register', data).then(function(registerData) {
          if (!vm.isAuthenticated) {
            vm.snackbarText = registerData;
            vm.snackbar = true;
          }
          vm.registerDialog = false;
        }).catch(function(err) {
          vm.snackbarText = err.toString();
          vm.snackbar = true;
        })
      },
      showRegister() {
        this.registerDialog = true;
      },
      showLogin() {
        this.loginDialog = true;
      },
      // Log the user out
      logout() {
        this.$store.dispatch('logout')
      }
    },
    computed: {
      isAuthenticated() {
        console.log(this.$store.state.token);
        return this.$store.state.token !== undefined && this.$store.state.token !== '';
      }
    }
  }
</script>
