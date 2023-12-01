import App from "src/App.svelte";
import "./app.css";

import * as dayjs from "dayjs";
import calendar from "dayjs/plugin/calendar";
import tz from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc)
dayjs.extend(tz)
dayjs.extend(calendar);


const target = document.getElementById("app")!;

const app = new App({
    target: target.parentElement!,
    anchor: target,
});

target.remove();

export default app;
