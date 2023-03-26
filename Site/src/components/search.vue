<template>
    <div class="d-flex justify-content-center">
        <div class="w-100 d-flex justify-content-center col-12 col-md-6">
            <div
                class="w-100 searchBox shadow-sm rounded-pill d-flex align-self-center justify-content-center rounded gap-3 mt-3 p-2">

                <div class="form-group">
                    <div class="dropdown">
                        <button class="bi-sliders btn searchButton" type="button" id="categoryDropdown"
                            data-bs-toggle="dropdown" aria-haspopup="true" :aria-expanded="false" style="font-size:1.5em">
                        </button>
                        <div class="dropdown-menu text-dark" aria-labelledby="categoryDropdown">
                            <a v-for="(option, index) in options" :key="index" class="dropdown-item"
                                :class="{ active: selectedOption === option.value }" href="#"
                                @click="selectedOption = option.value">{{ option.label }}</a>
                        </div>
                        <input type="hidden" v-model="selectedOption" id="category">
                    </div>
                </div>

                <div class="input-group d-flex align-items-center gap-2">
                    <input v-on:keyup.enter="onEnter" style="height: 40px;" class="form-control rounded-pill mr-sm-2"
                        v-model="searchInput" type="search" placeholder="Search" aria-label="Search" name="search">
                    <div class="input-group-append">
                        <button class="btn bi bi-search searchButton" style="font-size:1.5em" v-on:click="searchBook"
                            type="submit"></button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
  
<script>
export default {
    name: 'SearchBox',
    props: {
        options: {
            type: Array,
            required: true
        },
        cleared: {
            type: Function,
            default: () => { }
        }
    },
    data() {
        return {
            selectedOption: this.options[0].value,
            searchInput: '',
            clearedInput: false
        };
    },
    watch: {
        searchInput(newValue) {
            if (newValue === '' && !this.clearedInput) {
                this.clearedInput = true;
                this.$emit('cleared');
            } else {
                this.clearedInput = false;
            }
        }
    },
    methods: {
        searchBook() {
            this.$emit('search', {
                selectedOption: this.selectedOption,
                searchInput: this.searchInput
            });
        },
        onEnter() {
            this.searchBook();
        }
    }
};
</script>
  
<style scoped></style>
  