# Starfall Command

Create a polished sci-fi spaceship combat game UI prototype based closely on the attached reference image.

This is a GAME UI, not a website. Use a dark navy/black futuristic military sci-fi aesthetic with subtle metallic frames, thin glowing accents, clean typography and restrained neon highlights. Keep it elegant, readable and low-visual-noise. Avoid excessive glow, gradients, clutter, glassmorphism and oversized decorative elements.

Create these fully functional screens:

MAIN MENU

Play

Load Game

Online Play

Settings

Exit

RACE SELECTION

Humans

Robots

Sorras

Three large selectable race cards

Each card must have image area, race name and short description

Selected state must be clearly visible

Structure must support adding more races later

CHARACTER / CLASS SELECTION
Four selectable classes:

Melee

Ranger

Plasma

Special
Each class needs an icon/image area, name, short description and selected state.
The system must support adding more classes later.

INVENTORY & EQUIPMENT

Inventory item grid

Item quantity

Item rarity

Item selection

Equipment panel

Character equipment slots

Character preview area

Item tooltip/details panel

Inventory capacity indicator
The layout must remain stable when items are added or removed.

UPGRADE SCREEN
Create exactly 9 slots:

1 large central main item slot

6 surrounding equipment/item slots

2 material slots
The central item must visually connect to the surrounding slots.
Show upgrade success chance, required materials and an Upgrade button.
The structure must be reusable for different upgradeable items.

CHARACTER INFO

Character portrait/model area

Character name

Level

Race

Class

Health

Energy

Attack

Defense

Accuracy

Critical Chance

Speed

Additional character information tabs such as Info, Stats and Skills.

SETTINGS
Categories:

General

Graphics

Audio

Controls

Gameplay
Include appropriate controls such as dropdowns, sliders, toggles and buttons.

IMPORTANT DESIGN RULES:

All screens must share exactly the same visual design system.

Use reusable components for panels, buttons, tabs, item slots, cards, tooltips, stat rows and navigation.

Do not create each screen as an unrelated design.

Use consistent spacing, borders, corner treatment, typography and accent colors.

Keep panels clean and separated.

Nothing should overlap unintentionally.

No unnecessary decorative UI elements.

UI must look suitable for an actual PC sci-fi game rather than a futuristic website.

Desktop-first 16:9 layout.

Design at 1920x1080 proportions.

Keep the interface readable at 1080p.

Use mock data and placeholder artwork where necessary, but preserve dedicated image areas so real game assets can later replace them.

Make every button and navigation element functional.

Switching between screens should work.

Selected states, hover states, disabled states and active tabs should work.

Do not add authentication, database or backend functionality yet.

Focus entirely on the frontend UI prototype and interaction.

The attached image is the visual reference. Match its overall visual language, proportions and information hierarchy, but improve the layout where necessary for usability and game production.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/60f9340a-3a47-4da9-82d0-270343bf376e).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
