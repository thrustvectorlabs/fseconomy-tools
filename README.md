# README

FSEconomy Tools (FSET) - unofficial enhancements for FSEconomy (server.fseconomy.net)

# To install:

- Set up project

```
$ yarn
```

- Add Tampermonkey Script to Chrome from `tampermonkey-script` (see instructions below)
- Load FSE Homepage; check FSEconomy Tools Menu appears on the right

# To use it in Tampermonkey/Greasemonkey:

- Create a configuration file: copy the config.example.ts to config.ts (see instructions in config.example.ts as well)
- Run the project locally to get a built version of FSEconomy Tools (run `yarn build`). The file will be located in `./dist`
- Create a new script in tampermonkey
- Paste the contents of `tampermonkey-script/script.js` in the script
- Point the path at the @require line to where the built version of FSEconomy Tools is (a pre-built version will be made available later)

# To run locally:

`$ yarn start`

# About

This is an old project I had laying on the shelf and decided to dust it off and publish it on GitHub.
This tooling was created because I love FSEconomy (FSE). Among the career simulations available for flight simulators (particularly MSFS2020 and later), FSEconomy best meets my needs. However, I still have a long wishlist for FSEconomy. FSEconomy Tools offers:

- **Intuitive layout in FSEconomy Tools.** FSE may seem like a relic from the past and may not showcase its full potential. FSEconomy Tools provides an intuitive interface for finding assignments and aircraft that are ready to fly.
- **Default exclusion of broken aircraft.** Currently, you cannot filter out broken or unrepairable aircraft when searching. FSEconomy Tools ignores them by default.
- **SimBrief integration.** SimBrief delivers an advanced flight‑planning tool in an accessible format for flight simmers. FSEconomy Tools adds a link on the **My Flight** page to create a SimBrief flight plan based on the flight you have selected.
- **Airport warnings and updated ICAO identifiers.** On several occasions, I flew to an airport using the assignment's ICAO, only to find that FS Economy did not register my arrival because the ICAO had been reassigned. FSEconomy Tools maintains a manually curated list of affected ICAO identifiers to warn you in advance.
- **Payload matching.** When selecting an aircraft, you want to optimise payload. For example, a Cessna 208 can carry 13 passengers. After using the search

## PRs welcome

FSET is welcoming PRs. Techstack is TypeScript (strict), with React and Zustand for state management. Keep PRs small and feel free to open an issue first to discuss.

## Upcoming features

- Calculate and display net income when selecting a group of assignments
- Make a standalone version which can be directly loaded from Tampermonkey from a remote source

## What FSEconomy Tools is _not_:

- A tool that takes over FS Economy. All behaviour of the website is still exactly the same. If FSEconomy Tools adds something to the website (like SimBrief integration) it is clearly marked with the FSEconomy Tools badge.

### Reference links:

- FSEconomy Operations Guide: https://sites.google.com/site/fseoperationsguide/introduction
  - Assignments section: https://sites.google.com/site/fseoperationsguide/getting-started/assignments
- All SimBrief parameters: https://www.simbrief.com/forum/viewtopic.php?f=6&t=6&sid=95057b3e8d565e52c5e353d0df29aeea
