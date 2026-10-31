import { CurriculumLevel } from '../types/curriculum';

export const CURRICULUM_LEVELS: CurriculumLevel[] = [
  {
    levelNumber: 1,
    titleKey: 'foundations',
    descriptionKey: 'foundations_desc',
    title: {
      en: 'Level 1: Number Foundations',
      hi: 'स्तर 1: संख्या आधार',
    },
    description: {
      en: 'Counting, sequences, skip counting, and the power of repeated addition.',
      hi: 'गिनती, क्रम, अंतराल पर गणना और बार-बार जोड़ने की समझ।',
    },
    icon: '🔢',
    estimatedMinutes: 20,
    lessons: [
      {
        id: 'l1_1_counting',
        levelNumber: 1,
        lessonIndex: 1,
        title: {
          en: 'Counting & Sequences',
          hi: 'गिनती और संख्या क्रम',
        },
        subtitle: {
          en: 'See numbers as quantities of items.',
          hi: 'संख्याओं को वस्तुओं की मात्रा के रूप में समझें।',
        },
        type: 'concept',
        content: {
          storyText: {
            en: 'Every number represents a quantity. When we count items in groups, mathematics helps us find totals quickly.',
            hi: 'प्रत्येक संख्या एक मात्रा दर्शाती है। जब हम वस्तुओं को समूहों में गिनते हैं, तो गणित हमें तेजी से परिणाम देता है।',
          },
          explanation: {
            en: '1, 2, 3, 4, 5... each number is formed by adding one more item.',
            hi: '1, 2, 3, 4, 5... प्रत्येक संख्या एक वस्तु और जोड़ने पर बनती है।',
          },
          audioScript: {
            en: 'Welcome to Number Foundations! Let us explore how numbers grow by stepping forward one at a time.',
            hi: 'संख्या आधार में आपका स्वागत है! आइए समझें कि संख्याएँ कैसे आगे बढ़ती हैं।',
          },
        },
      },
      {
        id: 'l1_2_repeated_addition',
        levelNumber: 1,
        lessonIndex: 2,
        title: {
          en: 'Repeated Addition',
          hi: 'बार-बार जोड़ना',
        },
        subtitle: {
          en: 'Adding the same number over and over.',
          hi: 'एक ही संख्या को बार-बार जोड़ना।',
        },
        type: 'concept',
        content: {
          storyText: {
            en: 'Imagine you have 3 bowls. In each bowl, there are 2 cherries. How many cherries in total?',
            hi: 'कल्पना कीजिए आपके पास 3 कटोरियाँ हैं। प्रत्येक में 2 चेरी हैं। कुल कितनी चेरी हुईं?',
          },
          repeatedAdditionFormula: '2 + 2 + 2 = 6',
          multiplicationFormula: '3 × 2 = 6',
          explanation: {
            en: 'Adding 2 three times gives 6. This is the very foundation of multiplication!',
            hi: '2 को 3 बार जोड़ने से 6 मिलता है। यही गुणन की मूल नींव है!',
          },
          audioScript: {
            en: 'Two plus two plus two equals six. That is three groups of two, which equals six!',
            hi: 'दो जमा दो जमा दो बराबर छह। यानी दो के तीन समूह बराबर छह!',
          },
          visualGroups: { groups: 3, items: 2, emoji: '🍒' },
        },
      },
      {
        id: 'l1_3_skip_counting_2_5',
        levelNumber: 1,
        lessonIndex: 3,
        title: {
          en: 'Skip Counting by 2s and 5s',
          hi: '2 और 5 के अंतराल पर गिनती',
        },
        subtitle: {
          en: 'Jumping forward in equal steps.',
          hi: 'समान कदमों में छलांग लगाना।',
        },
        type: 'concept',
        content: {
          storyText: {
            en: 'When we skip count by 2: 2, 4, 6, 8, 10. When we skip count by 5: 5, 10, 15, 20, 25.',
            hi: 'जब हम 2 के अंतराल पर गिनते हैं: 2, 4, 6, 8, 10। 5 के अंतराल पर: 5, 10, 15, 20, 25।',
          },
          explanation: {
            en: 'Skip counting is like reciting the multiplication table in rhythm!',
            hi: 'अंतराल पर गिनती करना पहाड़ा याद करने का सबसे संगीतमय तरीका है!',
          },
          audioScript: {
            en: 'Listen closely: 5, 10, 15, 20, 25. Each jump adds exactly five.',
            hi: 'ध्यान से सुनें: 5, 10, 15, 20, 25। प्रत्येक छलांग में पाँच जुड़ते हैं।',
          },
        },
      },
    ],
  },
  {
    levelNumber: 2,
    titleKey: 'understanding_multiplication',
    descriptionKey: 'understanding_multiplication_desc',
    title: {
      en: 'Level 2: Understanding Multiplication',
      hi: 'स्तर 2: गुणन की समझ',
    },
    description: {
      en: 'Visual arrays, rows & columns, and equal groups.',
      hi: 'दृश्य व्यूह, पंक्तियाँ और स्तम्भ तथा समान समूह।',
    },
    icon: '🍏',
    estimatedMinutes: 25,
    lessons: [
      {
        id: 'l2_1_baskets_apples',
        levelNumber: 2,
        lessonIndex: 1,
        title: {
          en: 'Groups of Objects',
          hi: 'वस्तुओं के समूह',
        },
        subtitle: {
          en: '3 baskets with 4 apples each.',
          hi: '3 टोकरियाँ, प्रत्येक में 4 सेब।',
        },
        type: 'concept',
        content: {
          storyText: {
            en: 'There are 3 baskets. Each basket contains 4 apples. How many apples are there altogether?',
            hi: 'यहाँ 3 टोकरियाँ हैं। प्रत्येक टोकरी में 4 सेब हैं। कुल कितने सेब हैं?',
          },
          repeatedAdditionFormula: '4 + 4 + 4 = 12',
          multiplicationFormula: '3 × 4 = 12',
          explanation: {
            en: 'Multiplication (3 × 4) is simply a fast, efficient language for repeated addition (4 + 4 + 4).',
            hi: 'गुणन (3 × 4) बार-बार जोड़ने (4 + 4 + 4) की एक तेज और प्रभावी भाषा है।',
          },
          audioScript: {
            en: 'There are three baskets. Each basket contains four apples. Four plus four plus four equals twelve. Three times four equals twelve!',
            hi: 'तीन टोकरियाँ हैं। प्रत्येक में चार सेब हैं। चार जमा चार जमा चार बराबर बारह। तीन गुणा चार बराबर बारह!',
          },
          visualGroups: { groups: 3, items: 4, emoji: '🍎' },
        },
      },
      {
        id: 'l2_2_arrays_grid',
        levelNumber: 2,
        lessonIndex: 2,
        title: {
          en: 'Arrays: Rows and Columns',
          hi: 'व्यूह: पंक्तियाँ और स्तम्भ',
        },
        subtitle: {
          en: 'Grid layouts and the commutative property.',
          hi: 'ग्रिड संरचना और क्रम-विनिमेय नियम (3 × 4 = 4 × 3)।',
        },
        type: 'concept',
        content: {
          storyText: {
            en: 'Arrange 12 dots in 3 rows and 4 columns. Now turn your phone sideways: you see 4 rows of 3 columns. Both equal 12!',
            hi: '12 बिंदुओं को 3 पंक्तियों और 4 स्तम्भों में सजाएं। 3 × 4 = 12 और 4 × 3 = 12, दोनों एक समान हैं!',
          },
          multiplicationFormula: '3 × 4 = 4 × 3 = 12',
          explanation: {
            en: 'The Commutative Property: The order of factors does not change the product! 7 × 8 is always equal to 8 × 7.',
            hi: 'क्रम-विनिमेय नियम: संख्याओं का क्रम बदलने से गुणनफल नहीं बदलता! 7 × 8 हमेशा 8 × 7 के बराबर होता है।',
          },
          audioScript: {
            en: 'Notice this powerful secret: three times four is twelve, and four times three is also twelve. The order does not change the result!',
            hi: 'यह महत्वपूर्ण नियम याद रखें: तीन गुणा चार बारह है, और चार गुणा तीन भी बारह है। क्रम बदलने से उत्तर नहीं बदलता!',
          },
          visualGroups: { groups: 4, items: 3, emoji: '⭐' },
        },
      },
    ],
  },
  {
    levelNumber: 3,
    titleKey: 'tables_1_to_20',
    descriptionKey: 'tables_1_to_20_desc',
    title: {
      en: 'Level 3: Tables 1 to 20',
      hi: 'स्तर 3: पहाड़े 1 से 20',
    },
    description: {
      en: 'Master individual tables from Table 1 through Table 20 step by step.',
      hi: '1 से 20 तक के प्रत्येक पहाड़े का चरणबद्ध अभ्यास और स्मरण।',
    },
    icon: '📊',
    estimatedMinutes: 60,
    lessons: Array.from({ length: 20 }, (_, idx) => {
      const tableNum = idx + 1;
      return {
        id: `l3_table_${tableNum}`,
        levelNumber: 3 as const,
        lessonIndex: tableNum,
        title: {
          en: `Table of ${tableNum}`,
          hi: `${tableNum} का पहाड़ा`,
        },
        subtitle: {
          en: `Explore multiples and relationships of ${tableNum}.`,
          hi: `${tableNum} के गुणज और सम्बन्ध।`,
        },
        type: 'table' as const,
        targetTable: tableNum,
        content: {
          multiplicationFormula: `${tableNum} × 1 = ${tableNum} ... ${tableNum} × 10 = ${tableNum * 10}`,
          explanation: {
            en: `Every step adds another ${tableNum}. Key landmarks: ${tableNum} × 5 = ${tableNum * 5}, ${tableNum} × 10 = ${tableNum * 10}.`,
            hi: `प्रत्येक पद में ${tableNum} जुड़ता है। मुख्य बिंदु: ${tableNum} × 5 = ${tableNum * 5}, ${tableNum} × 10 = ${tableNum * 10}।`,
          },
          audioScript: {
            en: `Let us learn the table of ${tableNum}. ${tableNum} times one equals ${tableNum}. ${tableNum} times two equals ${tableNum * 2}.`,
            hi: `आइए ${tableNum} का पहाड़ा सीखें। ${tableNum} एकम ${tableNum}। ${tableNum} दूनी ${tableNum * 2}।`,
          },
        },
      };
    }),
  },
  {
    levelNumber: 4,
    titleKey: 'mixed_multiplication',
    descriptionKey: 'mixed_multiplication_desc',
    title: {
      en: 'Level 4: Mixed Multiplication Practice',
      hi: 'स्तर 4: मिश्रित गुणन अभ्यास',
    },
    description: {
      en: 'Randomized questions combining different tables to build cognitive flexibility.',
      hi: 'मिश्रित प्रश्नों द्वारा त्वरित निर्णय और गणना क्षमता का विकास।',
    },
    icon: '🔀',
    estimatedMinutes: 30,
    lessons: [
      {
        id: 'l4_1_mixed_basic',
        levelNumber: 4,
        lessonIndex: 1,
        title: {
          en: 'Randomized Mixed Tables (1–10)',
          hi: 'मिश्रित पहाड़े (1–10)',
        },
        subtitle: {
          en: 'Breaking linear recitation habits.',
          hi: 'सीधे क्रम में रटने की आदत तोड़ना।',
        },
        type: 'practice',
        content: {
          explanation: {
            en: 'In real life, math does not come in sequential order. Train your brain to retrieve facts independently!',
            hi: 'वास्तविक जीवन में गणित क्रमबद्ध नहीं आता। अपने मस्तिष्क को तुरंत याद करने के लिए तैयार करें!',
          },
          audioScript: {
            en: 'Get ready for mixed practice! We will jump between different tables without warning.',
            hi: 'मिश्रित अभ्यास के लिए तैयार हो जाइए! हम अलग-अलग पहाड़ों से प्रश्न पूछेंगे।',
          },
        },
      },
      {
        id: 'l4_2_mixed_advanced',
        levelNumber: 4,
        lessonIndex: 2,
        title: {
          en: 'Advanced Mixed Tables (11–20)',
          hi: 'उच्च स्तरीय मिश्रित पहाड़े (11–20)',
        },
        subtitle: {
          en: '17 × 8, 14 × 6, 19 × 7 and beyond.',
          hi: '17 × 8, 14 × 6, 19 × 7 और अन्य।',
        },
        type: 'practice',
        content: {
          explanation: {
            en: 'Mastering two-digit tables gives immense mental math confidence.',
            hi: 'दो अंकों के पहाड़ों में निपुणता मानसिक गणना में आत्मविश्वास प्रदान करती है।',
          },
          audioScript: {
            en: 'High level challenge ahead: tables eleven through twenty. Stay focused and trust your practice.',
            hi: 'उच्च स्तरीय चुनौती: 11 से 20 तक के पहाड़े। एकाग्र रहें!',
          },
        },
      },
    ],
  },
  {
    levelNumber: 5,
    titleKey: 'reverse_multiplication',
    descriptionKey: 'reverse_multiplication_desc',
    title: {
      en: 'Level 5: Reverse Multiplication',
      hi: 'स्तर 5: प्रतिलोम गुणन (विभाजन सम्बन्ध)',
    },
    description: {
      en: 'Which number multiplied by 7 gives 56? Connect multiplication to division.',
      hi: 'किस संख्या को 7 से गुणा करने पर 56 आता है? भाग और गुणा का सम्बन्ध।',
    },
    icon: '🔄',
    estimatedMinutes: 30,
    lessons: [
      {
        id: 'l5_1_reverse_concepts',
        levelNumber: 5,
        lessonIndex: 1,
        title: {
          en: 'The Inverse Relationship',
          hi: 'प्रतिलोम सम्बन्ध की समझ',
        },
        subtitle: {
          en: 'If 7 × 8 = 56, then 56 ÷ 7 = 8.',
          hi: 'यदि 7 × 8 = 56 है, तो 56 ÷ 7 = 8 होगा।',
        },
        type: 'concept',
        content: {
          storyText: {
            en: 'If you have 56 apples and want to share them equally among 7 friends, how many does each get? 8 apples!',
            hi: 'यदि आपके पास 56 सेब हैं और 7 मित्रों में बराबर बांटने हैं, तो प्रत्येक को 8 सेब मिलेंगे!',
          },
          multiplicationFormula: '56 ÷ 7 = 8  ⟺  7 × 8 = 56',
          explanation: {
            en: 'Division is asking: what factor is missing from the multiplication equation?',
            hi: 'भाग का सीधा अर्थ है: गुणन समीकरण में कौन सा पद गायब है?',
          },
          audioScript: {
            en: 'Which number multiplied by seven gives fifty-six? Think of your seven times table: seven times eight is fifty-six!',
            hi: 'किस संख्या को सात से गुणा करने पर छप्पन आता है? सात का पहाड़ा याद करें: सात अठे छप्पन!',
          },
        },
      },
    ],
  },
  {
    levelNumber: 6,
    titleKey: 'missing_numbers',
    descriptionKey: 'missing_numbers_desc',
    title: {
      en: 'Level 6: Missing-Number Equations',
      hi: 'स्तर 6: लुप्त संख्या समीकरण',
    },
    description: {
      en: 'Fill in equations like 8 × ? = 72 and ? × 6 = 48.',
      hi: '8 × ? = 72 और ? × 6 = 48 जैसे समीकरण हल करें।',
    },
    icon: '🧩',
    estimatedMinutes: 25,
    lessons: [
      {
        id: 'l6_1_missing_factors',
        levelNumber: 6,
        lessonIndex: 1,
        title: {
          en: 'Solving for the Unknown',
          hi: 'अज्ञात कारक की खोज',
        },
        subtitle: {
          en: 'Strengthening algebraic number bonds.',
          hi: 'गणितीय संख्या बंधनों को सुदृढ़ करना।',
        },
        type: 'practice',
        content: {
          explanation: {
            en: 'When one factor is hidden, you look at the product and use mental division.',
            hi: 'जब एक पद छिपा हो, तो गुणनफल को देखकर मानसिक भाग का उपयोग करें।',
          },
          audioScript: {
            en: 'Eight times what number equals seventy-two? Eight times nine is seventy-two!',
            hi: 'आठ को किस संख्या से गुणा करने पर बहत्तर आता है? आठ निम्मे बहत्तर!',
          },
        },
      },
    ],
  },
  {
    levelNumber: 7,
    titleKey: 'mental_shortcuts',
    descriptionKey: 'mental_shortcuts_desc',
    title: {
      en: 'Level 7: Mental Mathematics Shortcuts',
      hi: 'स्तर 7: मानसिक गणित शॉर्टकट',
    },
    description: {
      en: 'Multiply by 9, 11, 25, 50, doubling & halving, and distributive breakdown.',
      hi: '9, 11, 25, 50 से गुणा, आधा और दुगुना करना, और संख्याओं को तोड़कर जोड़ना।',
    },
    icon: '⚡',
    estimatedMinutes: 40,
    lessons: [
      {
        id: 'l7_1_distributive_breakdown',
        levelNumber: 7,
        lessonIndex: 1,
        title: {
          en: 'Distributive Property: Break & Add',
          hi: 'संख्याओं को तोड़कर जोड़ना',
        },
        subtitle: {
          en: '17 × 8 = (10 × 8) + (7 × 8) = 80 + 56 = 136.',
          hi: '17 × 8 = (10 × 8) + (7 × 8) = 80 + 56 = 136.',
        },
        type: 'shortcut',
        content: {
          storyText: {
            en: 'Never struggle with 17 × 8. Break 17 into (10 + 7). 10 × 8 is 80. 7 × 8 is 56. 80 + 56 = 136!',
            hi: '17 × 8 को कठिन न समझें। 17 को (10 + 7) में तोड़ें। 10 × 8 = 80 और 7 × 8 = 56। 80 + 56 = 136!',
          },
          multiplicationFormula: '17 × 8 = (10 × 8) + (7 × 8) = 80 + 56 = 136',
          explanation: {
            en: 'This method works for every two-digit multiplication in your head.',
            hi: 'यह विधि मस्तिष्क में किसी भी दो अंकों के गुणन के लिए सटीक काम करती है।',
          },
          audioScript: {
            en: 'To calculate seventeen times eight in your head: ten times eight is eighty. Seven times eight is fifty-six. Eighty plus fifty-six is one hundred thirty-six!',
            hi: 'सत्रह गुणा आठ के लिए: दस गुणा आठ अस्सी, सात गुणा आठ छप्पन। अस्सी और छप्पन मिलकर एक सौ छत्तीस बनते हैं!',
          },
        },
      },
      {
        id: 'l7_2_multiply_by_9',
        levelNumber: 7,
        lessonIndex: 2,
        title: {
          en: 'The 9s Secret: Multiply by 10 and Subtract',
          hi: '9 का जादुई नियम: 10 से गुणा करें और घटाएं',
        },
        subtitle: {
          en: '9 × 8 = (10 × 8) - 8 = 80 - 8 = 72.',
          hi: '9 × 8 = (10 × 8) - 8 = 80 - 8 = 72.',
        },
        type: 'shortcut',
        content: {
          multiplicationFormula: 'n × 9 = (n × 10) - n',
          explanation: {
            en: 'Because 9 is one less than 10, multiplying by 9 is simply multiplying by 10 and subtracting the number once.',
            hi: 'चूंकि 9, 10 से 1 कम है, इसलिए 9 से गुणा करने के लिए संख्या को 10 से गुणा कर एक बार घटा लें।',
          },
          audioScript: {
            en: 'Multiplying by nine is easy! Multiply by ten, then subtract the number. Ten times eight is eighty, minus eight is seventy-two.',
            hi: 'नौ से गुणा करना बेहद सरल है! दस से गुणा करके संख्या को घटा दें। अस्सी में से आठ घटाने पर बहत्तर मिलता है।',
          },
        },
      },
      {
        id: 'l7_3_multiply_by_11',
        levelNumber: 7,
        lessonIndex: 3,
        title: {
          en: 'The 11s Trick: Sandwich Addition',
          hi: '11 का नियम: अंकों का जोड़ बीच में',
        },
        subtitle: {
          en: '11 × 14 = 1 [1+4] 4 = 154.',
          hi: '11 × 14 = 1 [1+4] 4 = 154.',
        },
        type: 'shortcut',
        content: {
          multiplicationFormula: '11 × 14 = 154',
          explanation: {
            en: 'For 11 × 14, keep 1 at the front, 4 at the end, and add 1 + 4 = 5 in the middle: 154!',
            hi: '11 × 14 के लिए: पहला अंक 1, अंतिम अंक 4, और बीच में (1 + 4 = 5) रखें: 154!',
          },
          audioScript: {
            en: 'To multiply fourteen by eleven, add one plus four to get five, and place it between one and four: one hundred fifty-four!',
            hi: 'चौदह को ग्यारह से गुणा करने पर एक और चार का जोड़ पाँच बीच में आता है: एक सौ चौवन!',
          },
        },
      },
    ],
  },
  {
    levelNumber: 8,
    titleKey: 'real_world_math',
    descriptionKey: 'real_world_math_desc',
    title: {
      en: 'Level 8: Real-World Mathematics',
      hi: 'स्तर 8: व्यावहारिक दैनिक गणित',
    },
    description: {
      en: 'Shopping in INR (₹), packaging, time, distance, and everyday estimations.',
      hi: 'भारतीय रुपये (₹) में खरीदारी, पैकेजिंग, समय और दूरी की व्यावहारिक गणना।',
    },
    icon: '🛒',
    estimatedMinutes: 30,
    lessons: [
      {
        id: 'l8_1_shopping_inr',
        levelNumber: 8,
        lessonIndex: 1,
        title: {
          en: 'Market Purchases & Currency (₹)',
          hi: 'बाजार में खरीदारी और मुद्रा (₹)',
        },
        subtitle: {
          en: 'Price of 7 notebooks costing ₹25 each.',
          hi: '₹25 मूल्य वाली 7 कॉपियों का कुल मूल्य।',
        },
        type: 'real_world',
        content: {
          storyText: {
            en: 'You visit a local store to buy 7 notebooks. Each notebook costs ₹25. How much cash do you pay?',
            hi: 'आप स्टेशनरी से 7 कॉपियां खरीदते हैं। प्रत्येक कॉपी ₹25 की है। कुल कितने रुपये देंगे?',
          },
          multiplicationFormula: '7 × ₹25 = ₹175',
          explanation: {
            en: 'Think: 4 notebooks cost ₹100. The remaining 3 cost ₹75. ₹100 + ₹75 = ₹175!',
            hi: 'सोचें: 4 कॉपियां ₹100 की हुईं, शेष 3 कॉपियां ₹75 की। ₹100 + ₹75 = ₹175!',
          },
          audioScript: {
            en: 'Seven notebooks at twenty-five rupees each: four times twenty-five is one hundred, plus seventy-five is one hundred seventy-five rupees.',
            hi: 'पच्चीस रुपये की सात कॉपियां: चार बार पच्चीस सौ, और तीन बार पच्चीस पचहत्तर, कुल एक सौ पचहत्तर रुपये।',
          },
        },
      },
      {
        id: 'l8_2_packaging_boxes',
        levelNumber: 8,
        lessonIndex: 2,
        title: {
          en: 'Boxes & Packaging Units',
          hi: 'डिब्बे और पैकेजिंग इकाइयाँ',
        },
        subtitle: {
          en: '12 crates containing 8 bottles each.',
          hi: '12 क्रेट्स, प्रत्येक में 8 बोतलें।',
        },
        type: 'real_world',
        content: {
          storyText: {
            en: 'A delivery truck brings 12 crates of mango juice. Each crate holds 8 bottles. How many bottles in total?',
            hi: 'एक डिलीवरी ट्रक 12 क्रेट मैंगो जूस लाता है। प्रत्येक क्रेट में 8 बोतलें हैं। कुल कितनी बोतलें हैं?',
          },
          multiplicationFormula: '12 × 8 = 96',
          explanation: {
            en: '10 × 8 is 80. 2 × 8 is 16. 80 + 16 = 96 bottles.',
            hi: '10 × 8 = 80, 2 × 8 = 16, 80 + 16 = 96 बोतलें।',
          },
          audioScript: {
            en: 'Twelve crates with eight bottles each: ten times eight is eighty, plus sixteen is ninety-six bottles.',
            hi: 'बारह क्रेट्स में आठ-आठ बोतलें: दस अठे अस्सी और दो अठे सोलह, कुल छियानवे बोतलें।',
          },
        },
      },
    ],
  },
];
