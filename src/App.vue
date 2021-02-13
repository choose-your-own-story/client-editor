<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
        <div class="d-flex align-center">
            <v-btn @click="gotoHome()" icon>
                <v-avatar>
                    <v-img
                      alt="Elige tu propia aventura - Editor de historias"
                      class="shrink mr-2"
                      contain
                      :src="logoUrl()"
                      transition="scale-transition"
                      width="40"
                    />
                </v-avatar>
            </v-btn>
        </div>
        <span class="text-h5">
            Elige tu propia aventura - Editor
        </span>

        <v-spacer></v-spacer>

        <v-btn v-if="!isAuthenticated" @click="showLogin()" icon>
            <v-icon>mdi-account-key</v-icon>
        </v-btn>

        <v-btn v-if="!isAuthenticated" @click="showRegister()" icon>
            <v-icon>mdi-account-plus</v-icon>
        </v-btn>

        <v-btn
                v-if="isAuthenticated"
                @click="logout()"
                text
        >
            <v-icon>mdi-exit-run</v-icon>
        </v-btn>

        <v-avatar>
            <v-img :src="userThumb"></v-img>
        </v-avatar>
    </v-app-bar>

    <v-main>
        <v-dialog
                v-model="registerDialog"
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
                                <v-text-field label="User Password" v-model="userPassword" type="password"></v-text-field>
                                <v-text-field label="User Confirm Password" v-model="userPasswordConfirmation" type="password"></v-text-field>
                                <v-file-input
                                        v-model="fileModel"
                                        :rules="rules"
                                        accept="image/png, image/jpeg, image/bmp"
                                        prepend-icon="mdi-camera"
                                        label="Imagen"
                                        @change="handleFileUpload()"
                                />
                                <v-label>{{added_url}}</v-label>
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
                        Register
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog
                v-model="loginDialog"
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
                                <v-text-field label="User Password" v-model="userPassword" type="password"></v-text-field>
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
                        Login
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <router-view/>

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
    </v-main>

  </v-app>
</template>

<script>

export default {
  name: 'App',
  data: () => ({
    registerDialog: false,
    loginDialog: false,
    userName: '',
    userPassword: '',
    userPasswordConfirmation: '',
    snackbar: false,
    snackbarText: '',
    fileModel: [],
    added_url: '',
    rules: [
      // value => !value || value.size < 2000000 || 'Avatar size should be less than 2 MB!',
    ],
  }),
    methods: {
      logoUrl() {
        let pp = process.env.VUE_APP_PUBLIC_PATH;
        console.log(pp);
        if (pp.charAt(pp.length -1) !== '/')
            pp = `${pp}/`;
        console.log(pp);
        return `${pp}logo.png`;
      },
      gotoHome() {
        this.$router.push({
          name: 'Home'
        })
      },
      handleFileUpload: function() {
        let vm = this;
        if ((this.fileModel !== undefined) && (this.fileModel.name.length > 0)) {
          this.$store.dispatch('uploadImageBusiness', this.fileModel).then(function (newUrl) {
            console.log('exitos!');
            vm.added_url = newUrl
          });
        }
      },
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
        }).finally(function() {
          vm.userName = '';
          vm.userPassword = '';
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
          thumb: this.added_url
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
        }).finally(function() {
          vm.userName = '';
          vm.userPassword = '';
          vm.fileModel = [];
          vm.added_url = '';
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
        this.$store.dispatch('logout');
        this.$router.push('/');
      }

    },
  components: {

  },
  computed: {
    isAuthenticated() {
      console.log(this.$store.state.token);
      return this.$store.state.token !== undefined && this.$store.state.token !== '';
    },
    userThumb() {
      console.log(this.$store.state.userThumb);
      return this.$store.state.userThumb;
    }
  }
};
</script>
