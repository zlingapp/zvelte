import "./app.css";
import App from "./App.svelte";

import * as dayjs from "dayjs";
import calendar from "dayjs/plugin/calendar";
import utc from 'dayjs/plugin/utc'
import tz from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(tz)
dayjs.extend(calendar);


const target = document.getElementById("app");

const app = new App({
    target: target.parentElement,
    anchor: target,
});

target.remove();

export default app;
