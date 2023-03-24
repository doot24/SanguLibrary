<template>
    <button class="bi bi-calendar-date menubutton" style="font-size: 1.5em" @click="openCalendar"></button>
  </template>

  <style scoped></style>
  

  <script>
  export default {
    methods: {
      openCalendar() {
        const calendarUrl = 'https://calendar.google.com';
        const width = 800;
        const height = 600;
        const url = `${calendarUrl}?mode=AGENDA&height=${height}&wkst=1&bgcolor=%23ffffff&src=YOUR_CALENDAR_ID&color=%23B1440E&ctz=YOUR_TIME_ZONE`;
  
        window.open(url, '_blank', `width=${width},height=${height}`);
      },
    },
  };
  </script>
  