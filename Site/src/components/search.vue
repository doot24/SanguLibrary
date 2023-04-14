<template>
    <div class="d-flex justify-content-center">
        <div class="w-100 d-flex justify-content-center col-12 col-md-6">
            <div
                class="w-100 searchBox shadow-sm rounded-pill d-flex align-self-center justify-content-center rounded gap-3 mt-3 p-2">
                <div class="form-group">
                    <div v-if="options.length > 0" class="dropdown">
                        <button class="bi-sliders btn searchButton" type="button" id="categoryDropdown"
                            data-bs-toggle="dropdown" aria-haspopup="true" :aria-expanded="false" style="font-size:1.5em" />
                        <div  class="dropdown-menu" aria-labelledby="categoryDropdown">
                            <a v-for="(option, index) in options" :key="index" class="dropdown-item"
                                :class="{ active: selectedOption === option.Value }" href="#"
                                @click="selectedOption = option.Value">{{ option.Label }}</a>
                        </div>
                        <input type="hidden" v-model="selectedOption" id="category" />
                    </div>
                </div>
                <div class="input-group d-flex align-items-center gap-2">
                    <input v-on:keyup.enter="onEnter" style="height: 40px;" class="form-control rounded-pill mr-sm-2"
                        v-model="searchInput" type="search" placeholder="ძიება" aria-label="Search" name="search">
                    <div class="input-group-append">
                        <button class="btn bi bi-search searchButton" style="font-size:1.5em" v-on:click="searchBook" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style src="@/assets/css/components/search.css" scoped />

<script lang="ts">
import { defineComponent,PropType } from 'vue';
import {SearchOptions} from '@/interfaces/SearchOptions'

export default defineComponent({
    name: 'SearchBox',
    props: {
        options: {
            type:  Array as PropType<Array<SearchOptions>>,
            default : []
        },
        cleared: {
            type: Function,
            default: () => { }
        }
    },
    data() {
        return {
            selectedOption: this.options[0]?.Value,
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
});
</script>
<style scoped></style>