class GameLibrary:
    @staticmethod
    def get_game_config(subject, chapter, topic, standard, level=1):
        search_term = (topic if topic else chapter).lower()
        print(f"DEBUG: GameLibrary lookup - Subject: '{subject}', Standard: '{standard}', Search: '{search_term}', Level: {level}")
        
        # Normalize inputs
        subject = subject.lower() if subject else ""
        standard = str(standard)

        if subject == "math":
            search_term = (str(chapter) + " " + (str(topic) if topic else "")).lower()
            print(f"DEBUG: GameLibrary.get_game_config called. Subject={subject}, Standard={standard}, SearchTerm='{search_term}'")
            subject = subject.lower()

        # CLASS 6 - SCIENCE
        if subject == "science" and (standard is None or str(standard) == "6"):
            # Physics
            if any(k in search_term for k in ["motion", "measurement", "distance"]):
                return {
                    "type": "simulation",
                    "simType": "ruler",
                    "title": "Measure the Object 📏",
                    "goal": "Drag the pencil to align with the target measurement on the ruler!",
                    "initialState": {"objX": 50},
                    "targetState": {"targetX": 400}
                }
            if any(k in search_term for k in ["light", "shadow", "reflection"]):
                return {
                    "type": "simulation",
                    "simType": "torch",
                    "title": "Shadow Catcher 🔦",
                    "goal": "Move the torch to make the shadow match the target size!",
                    "initialState": {"torchX": 100},
                    "targetState": {"shadowSize": 200}
                }
            if any(k in search_term for k in ["electricity", "circuit"]):
                return {
                    "type": "builder",
                    "title": "Circuit Builder ⚡",
                    "goal": "Build a complete circuit to light up the bulb! You need a cell, a bulb, and a closed switch.",
                    "components": [
                        {"id": "c1", "label": "Cell", "icon": "🔋", "type": "cell"},
                        {"id": "c2", "label": "Bulb", "icon": "💡", "type": "bulb"},
                        {"id": "c3", "label": "Switch", "icon": "🔌", "type": "switch"},
                        {"id": "c4", "label": "Wire", "icon": "〰️", "type": "wire"}
                    ],
                    "slots": [
                        {"id": "s1", "label": "Power Source"},
                        {"id": "s2", "label": "Output"},
                        {"id": "s3", "label": "Control"},
                        {"id": "s4", "label": "Connector"}
                    ],
                    "logic": {
                        "requiredTypes": ["cell", "bulb", "switch"],
                        "successCondition": "all_types_present"
                    }
                }
            if any(k in search_term for k in ["magnet"]):
                return {
                    "type": "puzzle",
                    "title": "Magnet Maze 🧲",
                    "goal": "Drag the magnetic items to the magnet and non-magnetic items to the bin!",
                    "items": [
                        {"id": "m1", "label": "Iron Nail", "correctTarget": "magnet"},
                        {"id": "m2", "label": "Eraser", "correctTarget": "bin"},
                        {"id": "m3", "label": "Steel Clip", "correctTarget": "magnet"},
                        {"id": "m4", "label": "Plastic Pen", "correctTarget": "bin"}
                    ],
                    "targets": [
                        {"id": "magnet", "label": "Magnetic Items"},
                        {"id": "bin", "label": "Non-Magnetic Waste"}
                    ]
                }
            # Chemistry
            if "sorting" in search_term or "materials" in search_term:
                return {
                    "type": "puzzle",
                    "title": "Material Matcher 🏗️",
                    "goal": "Sort materials by their properties!",
                    "items": [
                        {"id": "mat1", "label": "Glass", "correctTarget": "transparent"},
                        {"id": "mat2", "label": "Wood", "correctTarget": "opaque"},
                        {"id": "mat3", "label": "Steel", "correctTarget": "hard"},
                        {"id": "mat4", "label": "Sponge", "correctTarget": "soft"}
                    ],
                    "targets": [
                        {"id": "transparent", "label": "Transparent"},
                        {"id": "opaque", "label": "Opaque"},
                        {"id": "hard", "label": "Hard"},
                        {"id": "soft", "label": "Soft"}
                    ]
                }
            if "separation" in search_term or "filter" in search_term:
                return {
                    "type": "puzzle",
                    "title": "Separation Center 🧪",
                    "goal": "Choose the correct method to separate these mixtures!",
                    "items": [
                        {"id": "sep1", "label": "Sand and Water", "correctTarget": "filtration"},
                        {"id": "sep2", "label": "Salt and Water", "correctTarget": "evaporation"},
                        {"id": "sep3", "label": "Iron Pins from Sand", "correctTarget": "magnetic"},
                        {"id": "sep4", "label": "Husk from Grain", "correctTarget": "winnowing"}
                    ],
                    "targets": [
                        {"id": "filtration", "label": "Filtration"},
                        {"id": "evaporation", "label": "Evaporation"},
                        {"id": "magnetic", "label": "Magnetic Separation"},
                        {"id": "winnowing", "label": "Winnowing"}
                    ]
                }
            # Biology
            if "food" in search_term or "nutrition" in search_term:
                return {
                    "type": "puzzle",
                    "title": "Food Sorter 🍎",
                    "goal": "Sort food into their major nutrient groups!",
                    "items": [
                        {"id": "f1", "label": "Rice", "correctTarget": "carbs"},
                        {"id": "f2", "label": "Pulses", "correctTarget": "protein"},
                        {"id": "f3", "label": "Butter", "correctTarget": "fats"},
                        {"id": "f4", "label": "Spinach", "correctTarget": "vitamins"}
                    ],
                    "targets": [
                        {"id": "carbs", "label": "Carbohydrates (Energy)"},
                        {"id": "protein", "label": "Proteins (Growth)"},
                        {"id": "fats", "label": "Fats (Stored Energy)"},
                        {"id": "vitamins", "label": "Vitamins & Minerals"}
                    ]
                }
            if "body movement" in search_term or "skeleton" in search_term:
                return {
                    "type": "puzzle",
                    "title": "Skeleton Snap 🦴",
                    "goal": "Drag the bones to where they belong in the body!",
                    "items": [
                        {"id": "s1", "label": "Skull", "correctTarget": "head"},
                        {"id": "s2", "label": "Ribcage", "correctTarget": "chest"},
                        {"id": "s3", "label": "Femur", "correctTarget": "leg"},
                        {"id": "s4", "label": "Humerus", "correctTarget": "arm"}
                    ],
                    "targets": [
                        {"id": "head", "label": "Head Area"},
                        {"id": "chest", "label": "Chest Area"},
                        {"id": "arm", "label": "Arm Area"},
                        {"id": "leg", "label": "Leg Area"}
                    ]
                }
            if "waste" in search_term or "garbage" in search_term:
                return {
                    "type": "puzzle",
                    "title": "Eco-Sorter ♻️",
                    "goal": "Sort the trash correctly to save the environment!",
                    "items": [
                        {"id": "w1", "label": "Vegetable Peels", "correctTarget": "green"},
                        {"id": "w2", "label": "Plastic Bottle", "correctTarget": "blue"},
                        {"id": "w3", "label": "Glass Jar", "correctTarget": "blue"},
                        {"id": "w4", "label": "Egg Shells", "correctTarget": "green"}
                    ],
                    "targets": [
                        {"id": "green", "label": "Biodegradable (Green Bin)"},
                        {"id": "blue", "label": "Recyclable (Blue Bin)"}
                    ]
                }
            if "changes" in search_term:
                return {
                    "type": "puzzle",
                    "title": "Change Sorter 🔄",
                    "goal": "Is the change Reversible or Irreversible?",
                    "items": [
                        {"id": "ch1", "label": "Melting of Ice", "correctTarget": "rev"},
                        {"id": "ch2", "label": "Burning Paper", "correctTarget": "irrev"},
                        {"id": "ch3", "label": "Folding Paper", "correctTarget": "rev"},
                        {"id": "ch4", "label": "Cooking Food", "correctTarget": "irrev"}
                    ],
                    "targets": [
                        {"id": "rev", "label": "Reversible Change"},
                        {"id": "irrev", "label": "Irreversible Change"}
                    ]
                }
            if "air" in search_term:
                return {
                    "type": "puzzle",
                    "title": "Air Components 🌬️",
                    "goal": "Sort the gases found in our atmosphere!",
                    "items": [
                        {"id": "g1", "label": "Nitrogen (78%)", "correctTarget": "major"},
                        {"id": "g2", "label": "Oxygen (21%)", "correctTarget": "major"},
                        {"id": "g3", "label": "Carbon Dioxide", "correctTarget": "minor"},
                        {"id": "g4", "label": "Dust & Smoke", "correctTarget": "minor"}
                    ],
                    "targets": [
                        {"id": "major", "label": "Major Components"},
                        {"id": "minor", "label": "Minor Components / Impurities"}
                    ]
                }
            if "plant" in search_term:
                return {
                    "type": "puzzle",
                    "title": "Plant Parts 🌿",
                    "goal": "Label the parts of the plant correctly!",
                    "items": [
                        {"id": "p1", "label": "Roots", "correctTarget": "underground"},
                        {"id": "p2", "label": "Stem", "correctTarget": "support"},
                        {"id": "p3", "label": "Leaf", "correctTarget": "kitchen"},
                        {"id": "p4", "label": "Flower", "correctTarget": "repro"}
                    ],
                    "targets": [
                        {"id": "underground", "label": "Absorbs Water (Roots)"},
                        {"id": "support", "label": "Supports Plant (Stem)"},
                        {"id": "kitchen", "label": "Makes Food (Leaf)"},
                        {"id": "repro", "label": "Seed Producer (Flower)"}
                    ]
                }
            if "living" in search_term or "surrounding" in search_term:
                return {
                    "type": "puzzle",
                    "title": "Habitat Matcher 🏜️",
                    "goal": "Match the animal to its correct habitat!",
                    "items": [
                        {"id": "a1", "label": "Camel", "correctTarget": "desert"},
                        {"id": "a2", "label": "Fish", "correctTarget": "water"},
                        {"id": "a3", "label": "Polar Bear", "correctTarget": "snow"},
                        {"id": "a4", "label": "Deer", "correctTarget": "forest"}
                    ],
                    "targets": [
                        {"id": "desert", "label": "Desert"},
                        {"id": "water", "label": "Aquatic"},
                        {"id": "snow", "label": "Polar Regions"},
                        {"id": "forest", "label": "Terrestrial (Forest)"}
                    ]
                }
            if "water" in search_term:
                return {
                    "type": "puzzle",
                    "title": "Water Wisdom 💧",
                    "goal": "Help conserve water! Sort these actions!",
                    "items": [
                        {"id": "wat1", "label": "Rainwater Harvesting", "correctTarget": "good"},
                        {"id": "wat2", "label": "Leaking Taps", "correctTarget": "bad"},
                        {"id": "wat3", "label": "Drip Irrigation", "correctTarget": "good"},
                        {"id": "wat4", "label": "Leaving tap open", "correctTarget": "bad"}
                    ],
                    "targets": [
                        {"id": "good", "label": "Good for Earth ✅"},
                        {"id": "bad", "label": "Wasting Water ❌"}
                    ]
                }

        # CLASS 7 - SCIENCE
        if subject == "science" and (standard is None or str(standard) == "7"):
            if "heat" in search_term:
                return {
                    "type": "simulation",
                    "simType": "thermometer",
                    "title": "Heat Lab 🌡️",
                    "goal": "Adjust the heat to reach the target temperature!",
                    "initialState": {"temp": 25},
                    "targetState": {"targetTemp": 75}
                }
            if "motion" in search_term and "time" in search_term:
                return {
                    "type": "simulation",
                    "simType": "race",
                    "title": "Speed Race 🏎️",
                    "goal": "Calculate the speed! Speed = Distance / Time.",
                    "initialState": {"distance": 100, "time": 10},
                    "targetState": {"correctSpeed": 10}
                }
            if "electric current" in search_term:
                return {
                    "type": "simulation",
                    "simType": "bulb_slider",
                    "title": "Glow Control 💡",
                    "goal": "Slide to adjust the resistance and make the bulb glow at the perfect brightness!",
                    "initialState": {"resistance": 50},
                    "targetState": {"perfectGlow": 20}
                }
            if "light" in search_term:
                return {
                    "type": "puzzle",
                    "title": "Mirror Magic 🪞",
                    "goal": "Classify the images formed by different mirrors!",
                    "items": [
                        {"id": "l1", "label": "Plane Mirror", "correctTarget": "same"},
                        {"id": "l2", "label": "Convex Mirror", "correctTarget": "smaller"},
                        {"id": "l3", "label": "Concave (Far)", "correctTarget": "inverted"},
                        {"id": "l4", "label": "Concave (Near)", "correctTarget": "larger"}
                    ],
                    "targets": [
                        {"id": "same", "label": "Same Size & Erect"},
                        {"id": "smaller", "label": "Diminished & Virtual (Rear View)"},
                        {"id": "inverted", "label": "Real & Inverted"},
                        {"id": "larger", "label": "Magnified & Erect (Dental Mirror)"}
                    ]
                }
            if "acid" in search_term or "base" in search_term or "salt" in search_term:
                return {
                    "type": "sort",
                    "title": "Virtual Litmus Test 🧪",
                    "goal": "Test the substances with Litmus Paper!",
                    "items": [
                        {"id": "ab1", "label": "Lemon Juice", "correctTarget": "acid"},
                        {"id": "ab2", "label": "Limewater", "correctTarget": "base"},
                        {"id": "ab3", "label": "Vinegar", "correctTarget": "acid"},
                        {"id": "ab4", "label": "Milk of Magnesia", "correctTarget": "base"}
                    ],
                    "targets": [
                        {"id": "acid", "label": "Turns Blue Litmus Red"},
                        {"id": "base", "label": "Turns Red Litmus Blue"}
                    ]
                }
            if "physical" in search_term and "chemical" in search_term:
                return {
                    "type": "puzzle",
                    "title": "Change Investigator 🕵️",
                    "goal": "Which changes form a new substance?",
                    "items": [
                        {"id": "pc1", "label": "Crystallization", "correctTarget": "physical"},
                        {"id": "pc2", "label": "Rusting", "correctTarget": "chemical"},
                        {"id": "pc3", "label": "Dissolving Sugar", "correctTarget": "physical"},
                        {"id": "pc4", "label": "Burning Magnesium", "correctTarget": "chemical"}
                    ],
                    "targets": [
                        {"id": "physical", "label": "Physical Change (No New Substance)"},
                        {"id": "chemical", "label": "Chemical Change (New Substance Formed!)"}
                    ]
                }

            if "nutrition" in search_term:
                return {
                    "type": "simulation",
                    "simType": "photosynthesis",
                    "title": "Photosynthesis Lab 🍃",
                    "goal": "Balance the sunlight and water to produce maximum energy!",
                    "initialState": {"sunlight": 50, "water": 50},
                    "targetState": {"targetEnergy": 100}
                }
            if "respiration" in search_term:
                return {
                    "type": "puzzle",
                    "title": "Respiration Rush 🫁",
                    "goal": "Sort the steps of respiration in the correct order!",
                    "items": [
                        {"id": "r1", "label": "Inhaling Oxygen", "correctTarget": "step1"},
                        {"id": "r2", "label": "Gas Exchange in Alveoli", "correctTarget": "step2"},
                        {"id": "r3", "label": "Cellular Respiration", "correctTarget": "step3"},
                        {"id": "r4", "label": "Exhaling Carbon Dioxide", "correctTarget": "step4"}
                    ],
                    "targets": [
                        {"id": "step1", "label": "Step 1: Intake"},
                        {"id": "step2", "label": "Step 2: Transport"},
                        {"id": "step3", "label": "Step 3: Energy Release"},
                        {"id": "step4", "label": "Step 4: Cleanup"}
                    ]
                }
            if "reproduction" in search_term and "plant" in search_term:
                return {
                    "type": "puzzle",
                    "title": "Pollination Puzzle 🌸",
                    "goal": "Match the flower parts to their functions!",
                    "items": [
                        {"id": "rep1", "label": "Stamen", "correctTarget": "male"},
                        {"id": "rep2", "label": "Pistil", "correctTarget": "female"},
                        {"id": "rep3", "label": "Petals", "correctTarget": "attract"},
                        {"id": "rep4", "label": "Pollen", "correctTarget": "male"}
                    ],
                    "targets": [
                        {"id": "male", "label": "Male Part / Male Gamete"},
                        {"id": "female", "label": "Female Part / Ovules"},
                        {"id": "attract", "label": "Attracts Insects"}
                    ]
                }
            if "wastewater" in search_term or "sewage" in search_term:
                return {
                    "type": "puzzle",
                    "title": "Clean Water Quest 🚰",
                    "goal": "Arrange the water treatment steps!",
                    "items": [
                        {"id": "ww1", "label": "Bar Screens (Large Trash)", "correctTarget": "step1"},
                        {"id": "ww2", "label": "Grit Removal", "correctTarget": "step2"},
                        {"id": "ww3", "label": "Aeration (Bacteria)", "correctTarget": "step3"},
                        {"id": "ww4", "label": "Chlorination", "correctTarget": "step4"}
                    ],
                    "targets": [
                        {"id": "step1", "label": "Phase 1: Screening"},
                        {"id": "step2", "label": "Phase 2: Sedimentation"},
                        {"id": "step3", "label": "Phase 3: Biological Treatment"},
                        {"id": "step4", "label": "Phase 4: Disinfection"}
                    ]
                }

        # CLASS 8 - SCIENCE
        if subject == "science" and (standard is None or str(standard) == "8"):
            if "force" in search_term or "pressure" in search_term:
                return {
                    "type": "simulation",
                    "simType": "pressure_lab",
                    "title": "Pressure Lab 🎈",
                    "goal": "Change the area of contact to see how pressure changes! Pressure = Force / Area.",
                    "initialState": {"force": 100, "area": 10},
                    "targetState": {"maxPressure": 50}
                }
            if "friction" in search_term:
                return {
                    "type": "simulation",
                    "simType": "friction_slider",
                    "title": "Friction Race 🏎️",
                    "goal": "Adjust the surface friction to reach the finish line without spinning out!",
                    "initialState": {"friction": 50},
                    "targetState": {"idealFriction": 30}
                }
            if "sound" in search_term:
                return {
                    "type": "simulation",
                    "simType": "pitch_match",
                    "title": "Pitch Perfect 🎵",
                    "goal": "Adjust the frequency to match the target sound pitch!",
                    "initialState": {"frequency": 200},
                    "targetState": {"targetFreq": 440}
                }
            if "metal" in search_term or "non-metal" in search_term:
                return {
                    "type": "puzzle",
                    "title": "Element Sorter 💎",
                    "goal": "Sort the elements into Metals and Non-Metals!",
                    "items": [
                        {"id": "el1", "label": "Iron (Ductile)", "correctTarget": "metal"},
                        {"id": "el2", "label": "Sulfur (Brittle)", "correctTarget": "nonmetal"},
                        {"id": "el3", "label": "Copper (Sonorous)", "correctTarget": "metal"},
                        {"id": "el4", "label": "Oxygen (Gas)", "correctTarget": "nonmetal"}
                    ],
                    "targets": [
                        {"id": "metal", "label": "Metals (Lustrous, Ductile)"},
                        {"id": "nonmetal", "label": "Non-Metals (Dull, Brittle)"}
                    ]
                }
            if "cell" in search_term and "structure" in search_term:
                return {
                    "type": "puzzle",
                    "title": "Cell Architect 🦠",
                    "goal": "Place the organelles in the correct cell type!",
                    "items": [
                        {"id": "c1", "label": "Cell Wall", "correctTarget": "plant"},
                        {"id": "c2", "label": "Chloroplast", "correctTarget": "plant"},
                        {"id": "c3", "label": "Centrioles", "correctTarget": "animal"},
                        {"id": "c4", "label": "Large Vacuole", "correctTarget": "plant"}
                    ],
                    "targets": [
                        {"id": "plant", "label": "Plant Cell Only"},
                        {"id": "animal", "label": "Animal Cell Only / Shared"}
                    ]
                }
            if "fibre" in search_term or "plastic" in search_term:
                return {
                    "type": "puzzle",
                    "title": "Fibre Finder 🧵",
                    "goal": "Identify if the fibre is Natural or Synthetic!",
                    "items": [
                        {"id": "fib1", "label": "Cotton", "correctTarget": "natural"},
                        {"id": "fib2", "label": "Nylon", "correctTarget": "synthetic"},
                        {"id": "fib3", "label": "Silk", "correctTarget": "natural"},
                        {"id": "fib4", "label": "Polyester", "correctTarget": "synthetic"}
                    ],
                    "targets": [
                        {"id": "natural", "label": "Natural (Plant/Animal)"},
                        {"id": "synthetic", "label": "Synthetic (Man-made)"}
                    ]
                }
            if "microorganism" in search_term:
                return {
                    "type": "sort",
                    "title": "Microbe Master 🦠",
                    "goal": "Sort the microbes! Are they Friends or Foes?",
                    "items": [
                        {"id": "mic1", "label": "Lactobacillus (Curd)", "correctTarget": "friend"},
                        {"id": "mic2", "label": "Malaria Parasite", "correctTarget": "foe"},
                        {"id": "mic3", "label": "Yeast (Baking)", "correctTarget": "friend"},
                        {"id": "mic4", "label": "Polio Virus", "correctTarget": "foe"}
                    ],
                    "targets": [
                        {"id": "friend", "label": "Friendly (Useful)"},
                        {"id": "foe", "label": "Harmful (Pathogens)"}
                    ]
                }

        # CLASS 9 - SCIENCE
        if subject == "science" and (standard is None or str(standard) == "9"):
            if "gravitation" in search_term:
                return {
                    "type": "simulation",
                    "simType": "gravity_drop",
                    "title": "Gravity Lab 🪐",
                    "goal": "Drop objects of different masses! Do they fall at the same rate in vacuum?",
                    "initialState": {"gravity": 9.8, "mass": 10},
                    "targetState": {"fallTime": 5}
                }
            if "motion" in search_term:
                return {
                    "type": "simulation",
                    "simType": "graph_plot",
                    "title": "Graph Mapper 📈",
                    "goal": "Match the motion of the car to the distance-time graph!",
                    "initialState": {"velocity": 10},
                    "targetState": {"graphType": "constant"}
                }
            if "matter" in search_term:
                return {
                    "type": "puzzle",
                    "title": "State Shifter 🧊",
                    "goal": "Identify the state of matter based on particle behavior!",
                    "items": [
                        {"id": "m1", "label": "Fixed Shape, Fixed Volume", "correctTarget": "solid"},
                        {"id": "m2", "label": "No Fixed Shape, Fixed Volume", "correctTarget": "liquid"},
                        {"id": "m3", "label": "No Fixed Shape, No Fixed Volume", "correctTarget": "gas"},
                        {"id": "m4", "label": "Highly Compressible", "correctTarget": "gas"}
                    ],
                    "targets": [
                        {"id": "solid", "label": "Solid State"},
                        {"id": "liquid", "label": "Liquid State"},
                        {"id": "gas", "label": "Gaseous State"}
                    ]
                }
            if "atom" in search_term or "molecule" in search_term:
                return {
                    "type": "builder",
                    "title": "Atomic Builder ⚛️",
                    "goal": "Build an atom! Place the correct number of protons, neutrons, and electrons.",
                    "components": [
                        {"id": "p1", "label": "Proton", "icon": "🔴", "type": "proton"},
                        {"id": "n1", "label": "Neutron", "icon": "⚪", "type": "neutron"},
                        {"id": "e1", "label": "Electron", "icon": "🔵", "type": "electron"}
                    ],
                    "slots": [
                        {"id": "nucleus", "label": "Nucleus"},
                        {"id": "orbit", "label": "Inner Orbit"}
                    ],
                    "logic": {
                        "requiredTypes": ["proton", "neutron", "electron"],
                        "successCondition": "neutral_atom"
                    }
                }

        # CLASS 10 - SCIENCE
        if subject.lower() == "science" and str(standard) == "10":
            # 1. Chemical Reactions and Equations
            if any(k in search_term for k in ["battle", "monster", "atom balance", "chemical battle"]):
                return {
                    "type": "simulation",
                    "simType": "equation_battle",
                    "title": "Equation Battle: Monster Meltdown 🧪💥",
                    "goal": "Defeat the monster by balancing the chemical equations!",
                    "equations": [
                        {
                            "id": "e1",
                            "unbalanced": "H2 + O2 → H2O",
                            "reactants": [{"id": "h2", "label": "H₂", "atoms": {"H": 2}}, {"id": "o2", "label": "O₂", "atoms": {"O": 2}}],
                            "products": [{"id": "h2o", "label": "H₂O", "atoms": {"H": 2, "O": 1}}],
                            "balanced": {"h2": 2, "o2": 1, "h2o": 2},
                            "monsterHealth": 100,
                            "damage": 50
                        },
                        {
                            "id": "e2",
                            "unbalanced": "Fe + H2O → Fe3O4 + H2",
                            "reactants": [{"id": "fe", "label": "Fe", "atoms": {"Fe": 1}}, {"id": "h2o", "label": "H₂O", "atoms": {"H": 2, "O": 1}}],
                            "products": [{"id": "fe3o4", "label": "Fe₃O₄", "atoms": {"Fe": 3, "O": 4}}, {"id": "h2", "label": "H₂", "atoms": {"H": 2}}],
                            "balanced": {"fe": 3, "h2o": 4, "fe3o4": 1, "h2": 4},
                            "monsterHealth": 150,
                            "damage": 75
                        }
                    ],
                    "initialState": {
                        "equationIdx": 0,
                        "monsterHealth": 100
                    }
                }

            if any(k in search_term for k in ["reaction", "equation", "chemical balance"]):
                return {
                    "type": "puzzle",
                    "title": "Reaction Balancer 🧪",
                    "goal": "Identify the type of chemical reaction!",
                    "items": [
                        {"id": "cr1", "label": "A + B -> AB", "correctTarget": "comb"},
                        {"id": "cr2", "label": "AB -> A + B", "correctTarget": "decomp"},
                        {"id": "cr3", "label": "Fe + CuSO4 -> FeSO4 + Cu", "correctTarget": "disp"},
                        {"id": "cr4", "label": "CH4 + O2 -> CO2 + H2O", "correctTarget": "combust"}
                    ],
                    "targets": [
                        {"id": "comb", "label": "Combination"},
                        {"id": "decomp", "label": "Decomposition"},
                        {"id": "disp", "label": "Displacement"},
                        {"id": "combust", "label": "Combustion"}
                    ]
                }

            # 2. Acids, Bases and Salts
            if any(k in search_term for k in ["acid", "base", "salt", "ph value"]):
                return {
                    "type": "sort",
                    "title": "pH Master ⚗️",
                    "goal": "Sort substances based on their pH value!",
                    "items": [
                        {"id": "ph1", "label": "Lemon Juice (pH 2)", "correctTarget": "acid"},
                        {"id": "ph2", "label": "Baking Soda (pH 9)", "correctTarget": "base"},
                        {"id": "ph3", "label": "Pure Water (pH 7)", "correctTarget": "neutral"},
                        {"id": "ph4", "label": "Soap Solution (pH 10)", "correctTarget": "base"}
                    ],
                    "targets": [
                        {"id": "acid", "label": "Acidic (pH < 7)"},
                        {"id": "neutral", "label": "Neutral (pH = 7)"},
                        {"id": "base", "label": "Basic (pH > 7)"}
                    ]
                }

            # 3. Metals and Non-metals
            if any(k in search_term for k in ["metal", "non-metal", "reactivity"]):
                return {
                    "type": "sort",
                    "title": "Reactivity Race 🏎️",
                    "goal": "Order the metals by reactivity (High to Low)!",
                    "items": [
                        {"id": "m1", "label": "Potassium (K)", "correctTarget": "high"},
                        {"id": "m2", "label": "Zinc (Zn)", "correctTarget": "med"},
                        {"id": "m3", "label": "Gold (Au)", "correctTarget": "low"},
                        {"id": "m4", "label": "Iron (Fe)", "correctTarget": "med"}
                    ],
                    "targets": [
                        {"id": "high", "label": "Most Reactive"},
                        {"id": "med", "label": "Moderately Reactive"},
                        {"id": "low", "label": "Least Reactive"}
                    ]
                }

            # 4. Carbon and its Compounds
            if any(k in search_term for k in ["carbon", "hydrocarbon", "methane", "bond"]):
                return {
                    "type": "builder",
                    "title": "Methane Maker ⚛️",
                    "goal": "Build a Methane (CH4) molecule! Carbon needs 4 bonds.",
                    "components": [
                        {"id": "c1", "label": "Carbon", "icon": "⚫", "type": "carbon"},
                        {"id": "h1", "label": "Hydrogen", "icon": "⚪", "type": "hydrogen"},
                        {"id": "o1", "label": "Oxygen", "icon": "🔴", "type": "oxygen"}
                    ],
                    "slots": [
                        {"id": "center", "label": "Center Atom"},
                        {"id": "bond1", "label": "Bond 1"},
                        {"id": "bond2", "label": "Bond 2"},
                        {"id": "bond3", "label": "Bond 3"},
                        {"id": "bond4", "label": "Bond 4"}
                    ],
                    "logic": {
                        "requiredTypes": ["carbon", "hydrogen"],
                        "successCondition": "molecule_match",
                        "targetMolecule": {"carbon": 1, "hydrogen": 4}
                    }
                }

            # 5. Periodic Classification
            if any(k in search_term for k in ["periodic", "element", "property", "table"]):
                return {
                    "type": "puzzle",
                    "title": "Periodic Treasure Hunt 💎",
                    "goal": "Find the element based on its property!",
                    "items": [
                        {"id": "p1", "label": "Most Electronegative", "correctTarget": "fluorine"},
                        {"id": "p2", "label": "Liquid at Room Temp", "correctTarget": "mercury"},
                        {"id": "p3", "label": "Noble Gas (Used in Bulbs)", "correctTarget": "argon"},
                        {"id": "p4", "label": "Alkali Metal (Soft)", "correctTarget": "sodium"}
                    ],
                    "targets": [
                        {"id": "fluorine", "label": "Fluorine"},
                        {"id": "mercury", "label": "Mercury"},
                        {"id": "argon", "label": "Argon"},
                        {"id": "sodium", "label": "Sodium"}
                    ]
                }

            # 6. Life Processes
            if any(k in search_term for k in ["life process", "organ", "function", "digestion", "respiration"]):
                return {
                    "type": "puzzle",
                    "title": "Organ Operator 🫀",
                    "goal": "Match the organ to its primary function!",
                    "items": [
                        {"id": "lp1", "label": "Heart", "correctTarget": "circ"},
                        {"id": "lp2", "label": "Kidney", "correctTarget": "excret"},
                        {"id": "lp3", "label": "Lungs", "correctTarget": "resp"},
                        {"id": "lp4", "label": "Stomach", "correctTarget": "digest"}
                    ],
                    "targets": [
                        {"id": "circ", "label": "Circulation (Pump Blood)"},
                        {"id": "excret", "label": "Excretion (Filter Blood)"},
                        {"id": "resp", "label": "Respiration (Gas Exchange)"},
                        {"id": "digest", "label": "Digestion (Break down food)"}
                    ]
                }

            # 7. Control and Coordination
            if any(k in search_term for k in ["control", "coordination", "neuron", "brain", "reflex"]):
                return {
                    "type": "puzzle",
                    "title": "Neuron Network 🧠",
                    "goal": "Trace the path of a reflex arc!",
                    "items": [
                        {"id": "n1", "label": "Receptor (Skin)", "correctTarget": "step1"},
                        {"id": "n2", "label": "Sensory Neuron", "correctTarget": "step2"},
                        {"id": "n3", "label": "Spinal Cord", "correctTarget": "step3"},
                        {"id": "n4", "label": "Motor Neuron", "correctTarget": "step4"}
                    ],
                    "targets": [
                        {"id": "step1", "label": "Stimulus Received"},
                        {"id": "step2", "label": "Signal Transmitted"},
                        {"id": "step3", "label": "Processing Center"},
                        {"id": "step4", "label": "Action Executed"}
                    ]
                }

            # 8. How do Organisms Reproduce?
            if any(k in search_term for k in ["reproduce", "reproduction", "asexual", "sexual"]):
                return {
                    "type": "sort",
                    "title": "Reproduction Lab 🦠",
                    "goal": "Classify the mode of reproduction!",
                    "items": [
                        {"id": "r1", "label": "Amoeba", "correctTarget": "asexual"},
                        {"id": "r2", "label": "Human", "correctTarget": "sexual"},
                        {"id": "r3", "label": "Hydra (Budding)", "correctTarget": "asexual"},
                        {"id": "r4", "label": "Flowering Plant", "correctTarget": "sexual"}
                    ],
                    "targets": [
                        {"id": "asexual", "label": "Asexual Reproduction"},
                        {"id": "sexual", "label": "Sexual Reproduction"}
                    ]
                }

            # 9. Heredity and Evolution
            if any(k in search_term for k in ["heredity", "evolution", "punnett", "gene", "trait"]):
                return {
                    "type": "puzzle",
                    "title": "Punnett Square Solver 🧬",
                    "goal": "Predict the offspring's traits (T = Tall, t = Short)!",
                    "items": [
                        {"id": "h1", "label": "TT", "correctTarget": "tall"},
                        {"id": "h2", "label": "Tt", "correctTarget": "tall"},
                        {"id": "h3", "label": "tt", "correctTarget": "short"}
                    ],
                    "targets": [
                        {"id": "tall", "label": "Phenotype: Tall"},
                        {"id": "short", "label": "Phenotype: Short"}
                    ]
                }

            # 10. Light - Reflection and Refraction
            if any(k in search_term for k in ["reflection", "refraction", "light", "lens", "mirror"]):
                # 8 Levels for Light Chapter
                light_levels = {
                    1: {
                        "type": "ray-optics",
                        "title": "Ray Drawing Challenge ✏️",
                        "goal": "Draw the incident and reflected rays correctly!",
                        "instruction": "Click and drag to draw a light ray reflecting off the mirror at the same angle.",
                        "source": { "x": 100, "y": 100, "angle": 45 },
                        "target": { "x": 700, "y": 100, "radius": 40 },
                        "availableTools": [{ "type": "draw_ray", "count": 1 }]
                    },
                    2: {
                        "type": "ray-optics",
                        "title": "Mirror Maze 🪞",
                        "goal": "Guide the light through the mirrors to the target!",
                        "instruction": "Place mirrors to reflect the beam into the goal.",
                        "source": { "x": 50, "y": 300, "angle": 0 },
                        "target": { "x": 750, "y": 500, "radius": 30 },
                        "availableTools": [{ "type": "mirror", "count": 2 }]
                    },
                    3: {
                        "type": "simulation",
                        "simType": "refraction_tank",
                        "title": "Refraction Tank ⚗️",
                        "goal": "Change the medium and see how light bends!",
                        "initialState": { "refractiveIndex": 1.0, "angle": 30 },
                        "targetState": { "targetBending": 15 }
                    },
                    4: {
                        "type": "simulation",
                        "simType": "lens_focuser",
                        "title": "Lens Focus Game 🔍",
                        "goal": "Adjust the lens position to focus the image clearly!",
                        "initialState": { "lensX": 200, "focalLength": 100 },
                        "targetState": { "isFocused": True }
                    },
                    5: {
                        "type": "puzzle",
                        "title": "True/False Ray Quiz ✅",
                        "goal": "Decide if these statements about light are True or False!",
                        "items": [
                            {"id": "q1", "label": "Angle of Incidence = Angle of Reflection", "correctTarget": "true"},
                            {"id": "q2", "label": "Light travels in a curved line", "correctTarget": "false"},
                            {"id": "q3", "label": "Refraction is the bending of light", "correctTarget": "true"},
                            {"id": "q4", "label": "A concave lens always magnifies", "correctTarget": "false"}
                        ],
                        "targets": [
                            {"id": "true", "label": "True"},
                            {"id": "false", "label": "False"}
                        ]
                    },
                    6: {
                        "type": "puzzle",
                        "title": "Drag-Drop Ray Diagram Labels 🏷️",
                        "goal": "Label the parts of the ray diagram!",
                        "items": [
                            {"id": "l1", "label": "Incident Ray", "correctTarget": "incoming"},
                            {"id": "l2", "label": "Reflected Ray", "correctTarget": "outgoing"},
                            {"id": "l3", "label": "Normal Line", "correctTarget": "perpendicular"},
                            {"id": "l4", "label": "Point of Incidence", "correctTarget": "surface"}
                        ],
                        "targets": [
                            {"id": "incoming", "label": "Incoming Beam"},
                            {"id": "outgoing", "label": "Reflected Beam"},
                            {"id": "perpendicular", "label": "90° Line"},
                            {"id": "surface", "label": "Hit Point"}
                        ]
                    },
                    7: {
                        "type": "puzzle",
                        "title": "Image Formation Puzzle 🧩",
                        "goal": "Match the object position to the image characteristics!",
                        "items": [
                            {"id": "p1", "label": "Object at Infinity", "correctTarget": "focus"},
                            {"id": "p2", "label": "Object at C", "correctTarget": "same_size"},
                            {"id": "p3", "label": "Object between F and P", "correctTarget": "virtual"}
                        ],
                        "targets": [
                            {"id": "focus", "label": "At Focus"},
                            {"id": "same_size", "label": "At C, Same Size"},
                            {"id": "virtual", "label": "Behind Mirror, Magnified"}
                        ]
                    },
                    8: {
                        "type": "ray-optics",
                        "title": "Boss: Mixed Ray Simulation Quiz 👹",
                        "goal": "Complete the final mission to become a Light Master!",
                        "boss": True,
                        "levels": [
                            {
                                "title": "Double Reflect",
                                "source": { "x": 50, "y": 100, "angle": 10 },
                                "target": { "x": 750, "y": 100, "radius": 20 },
                                "availableTools": [{ "type": "mirror", "count": 2 }]
                            }
                        ]
                    }
                }
                
                return light_levels.get(int(level), light_levels[1])

            # 11. Human Eye and Colorful World
            if any(k in search_term for k in ["human eye", "color", "defect", "eye", "vision", "prism"]):
                return {
                    "type": "simulation",
                    "simType": "eye_doctor",
                    "title": "Eye Focus Doctor 👨‍⚕️",
                    "goal": "Diagnose the vision defect and prescribe the correct lens!",
                    "initialState": {
                         "defect": "myopia" if "myopia" in search_term or "near" in search_term else "hypermetropia"
                    },
                    "targetState": {
                        "corrected": True
                    }
                }

            # 12. Magnetic Effects of Electric Current
            if any(k in search_term for k in ["magnetic", "field", "compass", "pole", "magnet"]):
                return {
                    "type": "simulation",
                    "simType": "magnetic_field",
                    "title": "Magnetic Field Builder",
                    "goal": "Master the properties of magnets!",
                    "levels": [
                        {
                            "id": 1,
                            "question": "Two bar magnets are brought close together with N facing N.\nWhat happens to the magnets?",
                            "visual": {
                                "type": "repulsion",
                                "magnets": [
                                    { "x": -100, "y": 0, "color": "red", "label": "N", "pole": "N" },
                                    { "x": 100, "y": 0, "color": "red", "label": "N", "pole": "N" }
                                ],
                                "arrows": ["<-", "->"]
                            },
                            "options": [
                                { "id": "a", "text": "They attract" },
                                { "id": "b", "text": "They repel", "correct": True },
                                { "id": "c", "text": "Nothing happens" },
                                { "id": "d", "text": "They rotate" }
                            ],
                            "hint": "Like poles repel each other!"
                        },
                        {
                            "id": 2,
                            "question": "A North pole and a South pole are brought close.\nWhat happens?",
                            "visual": {
                                "type": "attraction",
                                "magnets": [
                                    { "x": -100, "y": 0, "color": "red", "label": "N", "pole": "N" },
                                    { "x": 100, "y": 0, "color": "blue", "label": "S", "pole": "S" }
                                ],
                                "arrows": ["->", "<-"]
                            },
                            "options": [
                                { "id": "a", "text": "They attract", "correct": True },
                                { "id": "b", "text": "They repel" },
                                { "id": "c", "text": "They break" },
                                { "id": "d", "text": "Magnetic loss" }
                            ],
                            "hint": "Opposite poles attract each other!"
                        },
                        {
                            "id": 3,
                            "question": "Magnetic field lines emerge from which pole?",
                            "visual": {
                                "type": "field_lines",
                                "magnets": [
                                    { "x": 0, "y": 0, "color": "red-blue", "label": "N-S", "pole": "bar" }
                                ]
                            },
                            "options": [
                                { "id": "a", "text": "South Pole" },
                                { "id": "b", "text": "Middle" },
                                { "id": "c", "text": "North Pole", "correct": True },
                                { "id": "d", "text": "None" }
                            ],
                            "hint": "Field lines go from North to South outside the magnet."
                        }
                    ],
                    "initialState": {
                        "level": 0
                    }
                }

            # 13. Electricity
            if any(k in search_term for k in ["electricity", "circuit puzzle", "ohm's law", "resistance lab"]):
                return {
                    "type": "simulation",
                    "simType": "circuit_puzzle",
                    "title": "Circuit Puzzle Lab ⚡",
                    "goal": "Build circuits to match the target brightness! Remember V = IR.",
                    "levels": [
                        {
                            "title": "Series Starter",
                            "instruction": "Connect 2 Resistors in Series. Resistance increases!",
                            "targetCurrent": 0.5, # 10V / 20Ohm
                            "components": [
                                {"type": "battery", "voltage": 10},
                                {"type": "resistor", "resistance": 10},
                                {"type": "resistor", "resistance": 10},
                                {"type": "bulb"}
                            ]
                        },
                        {
                            "title": "Parallel Power",
                            "instruction": "Connect 2 Resistors in Parallel. Resistance decreases!",
                            "targetCurrent": 2.0, # 10V / 5Ohm
                            "components": [
                                {"type": "battery", "voltage": 10},
                                {"type": "resistor", "resistance": 10},
                                {"type": "resistor", "resistance": 10},
                                {"type": "bulb"}
                            ]
                        }
                    ],
                    "initialState": {
                        "level": 0,
                        "circuit": [] 
                    }
                }

            # 14. Sources of Energy
            if any(k in search_term for k in ["planner", "city", "strategy", "sustainability"]):
                return {
                    "type": "simulation",
                    "simType": "energy_planner",
                    "title": "Energy City Planner: Green Grid 🏙️🔋",
                    "goal": "Build a sustainable city grid and meet the energy demand!",
                    "initialState": {
                        "budget": 1200,
                        "targetPower": 150,
                        "pollution": 0,
                        "grid": [[None for _ in range(5)] for _ in range(5)],
                        "unlockedPlants": ["solar", "wind", "coal"]
                    },
                    "plantStats": {
                        "solar": {"name": "Solar Array", "cost": 150, "power": 15, "pollution": 0, "icon": "☀️"},
                        "wind": {"name": "Wind Turbine", "cost": 250, "power": 30, "pollution": 0, "icon": "🌬️"},
                        "coal": {"name": "Coal Plant", "cost": 100, "power": 50, "pollution": 40, "icon": "🏭"},
                        "nuclear": {"name": "Nuclear Plant", "cost": 600, "power": 100, "pollution": 5, "icon": "⚛️"}
                    },
                    "mechanics": {
                        "maxPollution": 100,
                        "baseDemand": 150
                    }
                }

            if any(k in search_term for k in ["source", "energy", "renewable", "fuel"]):
                return {
                    "type": "sort",
                    "title": "Energy Tycoon 🏭",
                    "goal": "Sort the energy sources into Renewable and Non-Renewable!",
                    "items": [
                        {"id": "e1", "label": "Solar Panel", "correctTarget": "renew"},
                        {"id": "e2", "label": "Coal Plant", "correctTarget": "nonrenew"},
                        {"id": "e3", "label": "Wind Turbine", "correctTarget": "renew"},
                        {"id": "e4", "label": "Diesel Gene", "correctTarget": "nonrenew"}
                    ],
                    "targets": [
                        {"id": "renew", "label": "Renewable (Clean)"},
                        {"id": "nonrenew", "label": "Non-Renewable (Fossil Fuels)"}
                    ]
                }

            # 15. Our Environment
            if any(k in search_term for k in ["environment", "ecosystem", "food chain", "pollution"]):
                return {
                    "type": "puzzle",
                    "title": "Food Chain Builder 🦅",
                    "goal": "Arrange the trophic levels correctly!",
                    "items": [
                        {"id": "fc1", "label": "Grass", "correctTarget": "prod"},
                        {"id": "fc2", "label": "Grasshopper", "correctTarget": "prim"},
                        {"id": "fc3", "label": "Frog", "correctTarget": "sec"},
                        {"id": "fc4", "label": "Snake", "correctTarget": "tert"}
                    ],
                    "targets": [
                        {"id": "prod", "label": "Producer"},
                        {"id": "prim", "label": "Primary Consumer"},
                        {"id": "sec", "label": "Secondary Consumer"},
                        {"id": "tert", "label": "Tertiary Consumer"}
                    ]
                }

            # 16. Sustainable Management
            if any(k in search_term for k in ["sustainable", "resource", "managment", "forest"]):
                return {
                    "type": "sort",
                    "title": "Sustainability Hero 🌳",
                    "goal": "Decide: Is this practice Sustainable or Unsustainable?",
                    "items": [
                        {"id": "s1", "label": "Reforestation", "correctTarget": "sus"},
                        {"id": "s2", "label": "Overfishing", "correctTarget": "unsus"},
                        {"id": "s3", "label": "Rainwater Harvesting", "correctTarget": "sus"},
                        {"id": "s4", "label": "Plastic Dumping", "correctTarget": "unsus"}
                    ],
                    "targets": [
                        {"id": "sus", "label": "Sustainable ✅"},
                        {"id": "unsus", "label": "Unsustainable ❌"}
                    ]
                }

        # CLASS 11 & 12 - SCIENCE
        if subject == "science":
            if "projectile" in search_term:
                return {
                    "type": "simulation",
                    "simType": "projectile",
                    "title": "Projectile Lab 🏀",
                    "goal": "Adjust the angle and velocity to hit the target!",
                    "initialState": {"angle": 45, "velocity": 20},
                    "targetState": {"targetDistance": 40}
                }
            if "logic gate" in search_term:
                return {
                    "type": "builder",
                    "title": "Gate Master 💻",
                    "goal": "Build a circuit that outputs 1 when both inputs are 1!",
                    "components": [
                        {"id": "g1", "label": "AND Gate", "icon": "⊓", "type": "and"},
                        {"id": "g2", "label": "OR Gate", "icon": "⊔", "type": "or"},
                        {"id": "g3", "label": "NOT Gate", "icon": "¬", "type": "not"}
                    ],
                    "slots": [
                        {"id": "input1", "label": "Input A (1)"},
                        {"id": "input2", "label": "Input B (1)"},
                        {"id": "gate", "label": "Logic Gate"}
                    ],
                    "logic": {
                        "requiredTypes": ["and"],
                        "successCondition": "output_match_one"
                    }
                }

        # MATHS - CLASSES 6-8
        if subject == "maths" or subject == "mathematics":
            # Class 6
            if "fraction" in search_term:
                return {
                    "type": "simulation",
                    "simType": "fraction_bar",
                    "title": "Fraction Factory 🍰",
                    "goal": "Shade the correct number of parts to represent the fraction!",
                    "initialState": {"numerator": 1, "denominator": 4},
                    "targetState": {"targetFraction": 0.75} # 3/4
                }
            if "ratio" in search_term or "proportion" in search_term:
                return {
                    "type": "puzzle",
                    "title": "Ratio Ranger ⚖️",
                    "goal": "Match the equivalent ratios!",
                    "items": [
                        {"id": "r1", "label": "1 : 2", "correctTarget": "2_4"},
                        {"id": "r2", "label": "3 : 4", "correctTarget": "6_8"},
                        {"id": "r3", "label": "2 : 5", "correctTarget": "4_10"}
                    ],
                    "targets": [
                        {"id": "2_4", "label": "2 : 4"},
                        {"id": "6_8", "label": "6 : 8"},
                        {"id": "4_10", "label": "4 : 10"}
                    ]
                }
            if "geometry" in search_term or "shape" in search_term:
                return {
                    "type": "simulation",
                    "simType": "shape_builder",
                    "title": "Shape Architect 📐",
                    "goal": "Identify the number of vertices and edges for this 3D shape!",
                    "initialState": {"shape": "cube"},
                    "targetState": {"vertices": 8, "edges": 12}
                }
            
            # Class 7
            if "integer" in search_term:
                return {
                    "type": "puzzle",
                    "title": "Integer Ascent 🧗",
                    "goal": "Calculate the final position! Start at -5, move +10, then -2.",
                    "items": [
                        {"id": "i1", "label": "Final Position", "correctTarget": "3"}
                    ],
                    "targets": [
                        {"id": "3", "label": "Position: 3"},
                        {"id": "8", "label": "Position: 8"}
                    ]
                }
            if "equation" in search_term:
                return {
                    "type": "simulation",
                    "simType": "balance_scale",
                    "title": "Equation Balancer ⚖️",
                    "goal": "Solve for x! Find the value that balances the scale: 2x + 5 = 15.",
                    "initialState": {"left": "2x + 5", "right": 15, "x": 0},
                    "targetState": {"correctX": 5}
                }
            
            # Class 8
            if "square" in search_term or "root" in search_term:
                return {
                    "type": "puzzle",
                    "title": "Root Rush ⚡",
                    "goal": "Match the numbers to their square roots!",
                    "items": [
                        {"id": "s1", "label": "144", "correctTarget": "12"},
                        {"id": "s2", "label": "169", "correctTarget": "13"},
                        {"id": "s3", "label": "225", "correctTarget": "15"}
                    ],
                    "targets": [
                        {"id": "12", "label": "12"},
                        {"id": "13", "label": "13"},
                        {"id": "15", "label": "15"}
                    ]
                }
            if "linear" in search_term and "one variable" in search_term:
                return {
                    "type": "simulation",
                    "simType": "graph_plotter",
                    "title": "Linear Explorer 📈",
                    "goal": "Plot the line for y = 2x + 1!",
                    "initialState": {"m": 0, "c": 0},
                    "targetState": {"m": 2, "c": 1}
                }

            # Class 9
            if "polynomial" in search_term:
                return {
                    "type": "simulation",
                    "simType": "polynomial_builder",
                    "title": "Zero Finder 🔍",
                    "goal": "Adjust the roots to match the polynomial graph of (x-2)(x+3)!",
                    "initialState": {"root1": 0, "root2": 0},
                    "targetState": {"root1": 2, "root2": -3}
                }
            if "coordinate" in search_term:
                return {
                    "type": "puzzle",
                    "title": "Quadrant Quest 🧭",
                    "goal": "Identify the quadrant for these coordinates!",
                    "items": [
                        {"id": "c1", "label": "(2, 3)", "correctTarget": "q1"},
                        {"id": "c2", "label": "(-2, 3)", "correctTarget": "q2"},
                        {"id": "c3", "label": "(-2, -3)", "correctTarget": "q3"},
                        {"id": "c4", "label": "(2, -3)", "correctTarget": "q4"}
                    ],
                    "targets": [
                        {"id": "q1", "label": "Quadrant I (+, +)"},
                        {"id": "q2", "label": "Quadrant II (-, +)"},
                        {"id": "q3", "label": "Quadrant III (-, -)"},
                        {"id": "q4", "label": "Quadrant IV (+, -)"}
                    ]
                }
            
            # Class 10
            if "trigonometry" in search_term:
                return {
                    "type": "simulation",
                    "simType": "trig_circle",
                    "title": "Trig Tower 🗼",
                    "goal": "Find the angle where sin(θ) = 0.5!",
                    "initialState": {"angle": 0},
                    "targetState": {"targetAngle": 30}
                }
            if "quadratic" in search_term:
                return {
                    "type": "puzzle",
                    "title": "Nature of Roots 🧬",
                    "goal": "Match the discriminant (D = b² - 4ac) to the nature of roots!",
                    "items": [
                        {"id": "q1", "label": "D > 0", "correctTarget": "real_dist"},
                        {"id": "q2", "label": "D = 0", "correctTarget": "real_equal"},
                        {"id": "q3", "label": "D < 0", "correctTarget": "img"}
                    ],
                    "targets": [
                        {"id": "real_dist", "label": "Real & Distinct"},
                        {"id": "real_equal", "label": "Real & Equal"},
                        {"id": "img", "label": "Imaginary (No Real Roots)"}
                    ]
                }
            
            # Class 11 & 12
            if "limit" in search_term:
                return {
                    "type": "simulation",
                    "simType": "limit_explorer",
                    "title": "Limit Leap 🚀",
                    "goal": "Approach x = 2 from both sides of f(x) = x². What is the limit?",
                    "initialState": {"x": 0},
                    "targetState": {"limitValue": 4}
                }
            if "matrix" in search_term:
                return {
                    "type": "puzzle",
                    "title": "Matrix Mixer 🧱",
                    "goal": "Calculate the determinant of this 2x2 matrix: [[2, 1], [3, 4]]",
                    "items": [
                        {"id": "m1", "label": "Determinant", "correctTarget": "5"}
                    ],
                    "targets": [
                        {"id": "5", "label": "5"},
                        {"id": "11", "label": "11"}
                    ]
                }

        return None
    @staticmethod
    def get_all_missions():
        """Returns a list of all pre-baked missions for the Mission Browser."""
        return [
            # Science - Class 6
            {"subject": "Science", "standard": "6", "topic": "Motion", "title": "Measure the Object 📏", "type": "simulation"},
            {"subject": "Science", "standard": "6", "topic": "Light", "title": "Shadow Catcher 🔦", "type": "simulation"},
            {"subject": "Science", "standard": "6", "topic": "Electricity", "title": "Circuit Builder ⚡", "type": "builder"},
            {"subject": "Science", "standard": "6", "topic": "Magnet", "title": "Magnet Maze 🧲", "type": "puzzle"},
            {"subject": "Science", "standard": "6", "topic": "Food", "title": "Food Sorter 🍎", "type": "puzzle"},
            
            # Science - Class 7
            {"subject": "Science", "standard": "7", "topic": "Heat", "title": "Heat Lab 🌡️", "type": "simulation"},
            {"subject": "Science", "standard": "7", "topic": "Respiration", "title": "Respiration Rush 🫁", "type": "puzzle"},
            {"subject": "Science", "standard": "7", "topic": "Litmus", "title": "Virtual Litmus Test 🧪", "type": "sort"},
            
            # Science - Class 8-10
            {"subject": "Science", "standard": "8", "topic": "Friction", "title": "Friction Race 🏎️", "type": "simulation"},
            {"subject": "Science", "standard": "8", "topic": "Cell", "title": "Cell Architect 🦠", "type": "puzzle"},
            {"subject": "Science", "standard": "9", "topic": "Atom", "title": "Atomic Builder ⚛️", "type": "builder"},
            {"subject": "Science", "standard": "10", "topic": "Eye", "title": "Eye Focus Lab 👁️", "type": "simulation"},
            {"subject": "Science", "standard": "12", "topic": "Logic Gate", "title": "Gate Master 💻", "type": "builder"},

            # Maths - Class 6-8
            {"subject": "Maths", "standard": "6", "topic": "Fraction", "title": "Fraction Factory 🍰", "type": "simulation"},
            {"subject": "Maths", "standard": "7", "topic": "Equation", "title": "Equation Balancer ⚖️", "type": "simulation"},
            {"subject": "Maths", "standard": "8", "topic": "Square Root", "title": "Root Rush ⚡", "type": "puzzle"},
            
            # Maths - Class 9-12
            {"subject": "Maths", "standard": "9", "topic": "Polynomial", "title": "Zero Finder 🔍", "type": "simulation"},
            {"subject": "Maths", "standard": "10", "topic": "Trigonometry", "title": "Trig Tower 🗼", "type": "simulation"},
            {"subject": "Maths", "standard": "11", "topic": "Limit", "title": "Limit Leap 🚀", "type": "simulation"},
            {"subject": "Maths", "standard": "12", "topic": "Matrix", "title": "Matrix Mixer 🧱", "type": "puzzle"}
        ]
