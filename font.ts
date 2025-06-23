import { Manrope, Rubik , Playfair_Display, Roboto} from 'next/font/google';

export const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export const rubik = Rubik({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
});

export const playfair_display = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
});

export const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

// | Tailwind Class | Font Size (rem) | Font Size (px) | Notes           |
// | -------------- | --------------- | -------------- | --------------- |
// | `text-xs`      | `0.75rem`       | `12px`         | Extra small     |
// | `text-sm`      | `0.875rem`      | `14px`         | Small           |
// | `text-base`    | `1rem`          | `16px`         | Base (default)  |
// | `text-lg`      | `1.125rem`      | `18px`         | Large           |
// | `text-xl`      | `1.25rem`       | `20px`         | Extra large     |
// | `text-2xl`     | `1.5rem`        | `24px`         |                 |
// | `text-3xl`     | `1.875rem`      | `30px`         |                 |
// | `text-4xl`     | `2.25rem`       | `36px`         |                 |
// | `text-5xl`     | `3rem`          | `48px`         |                 |
// | `text-6xl`     | `3.75rem`       | `60px`         |                 |
// | `text-7xl`     | `4.5rem`        | `72px`         |                 |
// | `text-8xl`     | `6rem`          | `96px`         |                 |
// | `text-9xl`     | `8rem`          | `128px`        | Extremely large |


// | Tailwind Class | Approx. Pixels     | Notes              |
// | -------------- | ------------------ | ------------------ |
// | `w-0`          | `0px`              | No width           |
// | `w-px`         | `1px`              | One physical pixel |
// | `w-1`          | `0.25rem` = `4px`  |                    |
// | `w-2`          | `0.5rem` = `8px`   |                    |
// | `w-3`          | `0.75rem` = `12px` |                    |
// | `w-4`          | `1rem` = `16px`    |                    |
// | `w-5`          | `1.25rem` = `20px` |                    |
// | `w-6`          | `1.5rem` = `24px`  |                    |
// | `w-8`          | `2rem` = `32px`    |                    |
// | `w-10`         | `2.5rem` = `40px`  |                    |
// | `w-12`         | `3rem` = `48px`    |                    |
// | `w-16`         | `4rem` = `64px`    |                    |
// | `w-20`         | `5rem` = `80px`    |                    |
// | `w-24`         | `6rem` = `96px`    |                    |
// | `w-32`         | `8rem` = `128px`   |                    |
// | `w-40`         | `10rem` = `160px`  |                    |
// | `w-48`         | `12rem` = `192px`  |                    |
// | `w-56`         | `14rem` = `224px`  |                    |
// | `w-64`         | `16rem` = `256px`  |                    |
// | `w-full`       | `100%`             | Fills parent       |
// | `w-screen`     | `100vw`            | Fills viewport     |
// | `w-auto`       | auto               | Based on content   |

// | Tailwind Class | Approx. Pixels | Notes |
// | -------------- | -------------- | ----- |
// | `h-0`          | `0px`          |       |
// | `h-px`         | `1px`          |       |
// | `h-1`          | `4px`          |       |
// | `h-2`          | `8px`          |       |
// | `h-3`          | `12px`         |       |
// | `h-4`          | `16px`         |       |
// | `h-5`          | `20px`         |       |
// | `h-6`          | `24px`         |       |
// | `h-8`          | `32px`         |       |
// | `h-10`         | `40px`         |       |
// | `h-12`         | `48px`         |       |
// | `h-16`         | `64px`         |       |
// | `h-20`         | `80px`         |       |
// | `h-24`         | `96px`         |       |
// | `h-32`         | `128px`        |       |
// | `h-40`         | `160px`        |       |
// | `h-48`         | `192px`        |       |
// | `h-64`         | `256px`        |       |
// | `h-full`       | `100%`         |       |
// | `h-screen`     | `100vh`        |       |
// | `h-auto`       | auto           |       |

// | Class   | rem Value  | Pixel Value |
// | ------- | ---------- | ----------- |
// | `m-0`   | `0rem`     | `0px`       |
// | `m-px`  | `1px`      | `1px`       |
// | `m-0.5` | `0.125rem` | `2px`       |
// | `m-1`   | `0.25rem`  | `4px`       |
// | `m-1.5` | `0.375rem` | `6px`       |
// | `m-2`   | `0.5rem`   | `8px`       |
// | `m-2.5` | `0.625rem` | `10px`      |
// | `m-3`   | `0.75rem`  | `12px`      |
// | `m-3.5` | `0.875rem` | `14px`      |
// | `m-4`   | `1rem`     | `16px`      |
// | `m-5`   | `1.25rem`  | `20px`      |
// | `m-6`   | `1.5rem`   | `24px`      |
// | `m-7`   | `1.75rem`  | `28px`      |
// | `m-8`   | `2rem`     | `32px`      |
// | `m-9`   | `2.25rem`  | `36px`      |
// | `m-10`  | `2.5rem`   | `40px`      |
// | `m-11`  | `2.75rem`  | `44px`      |
// | `m-12`  | `3rem`     | `48px`      |
// | `m-14`  | `3.5rem`   | `56px`      |
// | `m-16`  | `4rem`     | `64px`      |
// | `m-20`  | `5rem`     | `80px`      |
// | `m-24`  | `6rem`     | `96px`      |
// | `m-28`  | `7rem`     | `112px`     |
// | `m-32`  | `8rem`     | `128px`     |
// | `m-36`  | `9rem`     | `144px`     |
// | `m-40`  | `10rem`    | `160px`     |
// | `m-44`  | `11rem`    | `176px`     |
// | `m-48`  | `12rem`    | `192px`     |
// | `m-52`  | `13rem`    | `208px`     |
// | `m-56`  | `14rem`    | `224px`     |
// | `m-60`  | `15rem`    | `240px`     |
// | `m-64`  | `16rem`    | `256px`     |
// | `m-72`  | `18rem`    | `288px`     |
// | `m-80`  | `20rem`    | `320px`     |
// | `m-96`  | `24rem`    | `384px`     |
