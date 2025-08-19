# README

FSEconomy Tools - unofficial enhancements for FSEconomy (server.fseconomy.net)

# To install:

- Set up project

```
$ yarn
```

- Add Tampermonkey Script to Chrome from `tampermonkey-script`
- Load FSE Homepage; check FSE Tools Menu appears on the right

# To run:

`$ yarn start`

# About

This tooling was created because I love FSEconomy (FSE). Among the career simulations available for flight simulators (particularly MSFS2020 and later), FSEconomy best meets my needs. However, I still have a long wishlist for FSEconomy. FSE Tools offers:

- **Modernized layout.** FSE may seem like a relic from the past and may not showcase its full potential. FSE Tools provides an intuitive interface for finding assignments and aircraft that are ready to fly.
- **Default exclusion of broken aircraft.** Currently, you cannot filter out broken or unrepairable aircraft when searching. FSE Tools ignores them by default.
- **SimBrief integration.** SimBrief delivers an advanced flight‑planning tool in an accessible format for flight simmers. FSE Tools adds a link on the **My Flight** page to create a SimBrief flight plan based on the flight you have selected.
- **Airport warnings and updated ICAO identifiers.** On several occasions, I flew to an airport using the assignment’s ICAO, only to find that FS Economy did not register my arrival because the ICAO had been reassigned. FSE Tools maintains a manually curated list of affected ICAO identifiers to warn you in advance.

## Future features

- **Payload matching.** When selecting an aircraft, you want to optimise payload. For example, a Cessna 208 can carry 13 passengers. It would be useful to locate airports that can accommodate the best payload for a C208.

## What FSE Tools is _not_:

- A tool that takes over FS Economy. All behaviour of the website is still exactly the same. If FSE Tools adds something to the website (like SimBrief integration) it is clearly marked with the FSE Tools badge.

# FSEconomy Documentation

## FSEconomy Assignment Types

FSEconomy assignments have different types indicating requirements and restrictions:

| Type   | Description                                                                                        |
| ------ | -------------------------------------------------------------------------------------------------- |
| **T**  | _Trip_: Standard assignment. Any compatible aircraft can be used.                                  |
| **V**  | _VIP_: Exclusive charter. Requires dedicated aircraft and no other jobs.                           |
| **A**  | _All-In_: Entire aircraft is chartered. No other assignments allowed. Multi-leg flights permitted. |
| **A→** | _All-In Direct_: Like **A**, but must be flown nonstop. No intermediate stops.                     |

### Notes

- **Exclusive Use**: Both **V**, **A**, and **A→** require dedicated use of the aircraft.
- **Multi-leg Flights**: Allowed for **T**, **V**, and **A**, but **A→** requires a single direct leg.
- **Fixed Payment**: All-In flights have a fixed payment minus any ground crew fees.

### Reference links:

- FSEconomy Operations Guide: https://sites.google.com/site/fseoperationsguide/introduction
  - Assignments section: https://sites.google.com/site/fseoperationsguide/getting-started/assignments
- All SimBrief parameters: https://www.simbrief.com/forum/viewtopic.php?f=6&t=6&sid=95057b3e8d565e52c5e353d0df29aeea
