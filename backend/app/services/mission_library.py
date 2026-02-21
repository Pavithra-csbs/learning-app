class MissionLibrary:
    @staticmethod
    def get_mission(subject, topic):
        """Returns pre-baked, strictly NCERT-aligned mission content for common topics."""
        library = {
            "science": {
                "Chemical Reactions and Equations": {
                    "title": "Chemical Reactions and Equations",
                    "introduction": "In our daily life, we see many changes like milk turning into curd or iron getting rusted. These are all examples of chemical reactions!",
                    "visual_description": "A picture showing a Magnesium ribbon burning in air with a dazzling white flame to form white Magnesium Oxide powder.",
                    "sections": [
                        {
                            "heading": "Chemical Equations",
                            "content": "A chemical equation uses symbols and formulas to show a reaction. It helps us see the reactants turning into products simply."
                        },
                        {
                            "heading": "Balanced Equations",
                            "content": "Just like a balance scale, both sides of a chemical equation must have the same number of atoms. This is called balancing an equation."
                        }
                    ],
                    "activity": "Clean a magnesium ribbon with sandpaper and burn it using a spirit lamp. Collect the white ash in a watch glass.",
                    "summary": "Chemical reactions occur when old bonds break and new bonds form to produce new substances.",
                    "key_facts": [
                        "Mass cannot be created or destroyed in a reaction.",
                        "Reactants are on the left side, products on the right.",
                        "A precipitate is an insoluble solid formed in a reaction."
                    ]
                },
                "Acids, Bases and Salts": {
                    "title": "Acids, Bases and Salts",
                    "introduction": "Did you know that lemons taste sour because they have acids, and soap feels slippery because it is a base? Let's explore these amazing chemicals!",
                    "visual_description": "A diagram of a pH scale showing colors from red (strong acid) to green (neutral) to purple (strong base).",
                    "sections": [
                        {
                            "heading": "Indicators",
                            "content": "Indicators are special substances that change color to tell us if something is an acid or a base, like Litmus or Turmeric."
                        },
                        {
                            "heading": "Neutralization",
                            "content": "When an Acid and a Base are mixed together, they cancel each other out to form Salt and Water. This is a friendly reaction!"
                        }
                    ],
                    "activity": "Take some lemon juice and add a drop of blue litmus solution. See how it turns red? This proves lemon is an acid!",
                    "summary": "Acids are sour, Bases are bitter and slippery, and Salts are formed when they react together.",
                    "key_facts": [
                        "Acids turn blue litmus red.",
                        "Bases turn red litmus blue.",
                        "The pH of pure water is 7 (neutral)."
                    ]
                },
                "Life Processes": {
                    "title": "Life Processes",
                    "introduction": "All living things perform basic functions like eating, breathing, and growing to stay alive. We call these 'Life Processes'.",
                    "visual_description": "A simple drawing of a human heart showing how it pumps blood to the lungs and the rest of the body.",
                    "sections": [
                        {
                            "heading": "Nutrition",
                            "content": "Plants make their own food using sunlight (Autotrophs), while animals eat plants or other animals (Heterotrophs) for energy."
                        },
                        {
                            "heading": "Respiration",
                            "content": "Respiration is the process where our body breaks down food to release the energy we need to move and play."
                        }
                    ],
                    "activity": "Breathe into a glass of lime water using a straw. See it turn milky? This proves we breathe out Carbon Dioxide!",
                    "summary": "Life processes like nutrition, respiration, and excretion are essential for every living organism to survive.",
                    "key_facts": [
                        "Chlorophyll is needed for photosynthesis.",
                        "Hemoglobin carries oxygen in our blood.",
                        "Nephrons are the filtering units in our kidneys."
                    ]
                }
            },
            "math": {
                "Real Numbers": {
                    "title": "Real Numbers",
                    "introduction": "Numbers are like the alphabet of Math! Real numbers include all the numbers we use for counting, sharing, and measuring.",
                    "visual_description": "A number line showing zero in the middle, with positive numbers on the right and negative numbers on the left.",
                    "sections": [
                        {
                            "heading": "Euclids Division Lemma",
                            "content": "This is a simple rule: for any two numbers 'a' and 'b', we can always find a quotient and a remainder when we divide them."
                        },
                        {
                            "heading": "Prime Factors",
                            "content": "Every large number can be broken down into 'Prime Numbers'. It's like finding the basic building blocks of a number."
                        }
                    ],
                    "activity": "Take the number 12 and try to divide it only by prime numbers like 2 and 3. You'll find 12 = 2 x 2 x 3!",
                    "summary": "Real numbers help us count and measure everything in the world around us with perfect accuracy.",
                    "key_facts": [
                        "Every whole number is a real number.",
                        "The HCF is the largest common factor of two numbers.",
                        "Numbers like √2 that cannot be written as a fraction are called Irrational."
                    ]
                },
                "Polynomials": {
                    "title": "Polynomials",
                    "introduction": "Polynomials are mathematical expressions that use numbers and letters (like 'x') to describe paths and shapes!",
                    "visual_description": "A graph showing a straight line for a simple polynomial and a 'U' shape for a slightly more complex one.",
                    "sections": [
                        {
                            "heading": "Degrees of Polynomials",
                            "content": "The 'Degree' is just the highest power in the expression. A degree of 1 makes a straight line, and 2 makes a curve."
                        },
                        {
                            "heading": "Zeroes of a Polynomial",
                            "content": "A 'Zero' is a magic value for 'x' that makes the whole expression equal to 0. It's where the graph touches the floor!"
                        }
                    ],
                    "activity": "Draw a straight line on a graph. Where it crosses the x-axis is the 'Zero' of that linear polynomial!",
                    "summary": "Understanding polynomials helps us solve puzzles and model the real world with algebra.",
                    "key_facts": [
                        "A linear polynomial has exactly one zero.",
                        "Quadratic polynomials have a degree of 2.",
                        "The x-intercepts of a graph are its zeroes."
                    ]
                }
            }
        }

        subj = subject.lower()
        if subj not in library: return None
        
        for key in library[subj]:
            if key.lower() in topic.lower() or topic.lower() in key.lower():
                return library[subj][key]
                
        return None
