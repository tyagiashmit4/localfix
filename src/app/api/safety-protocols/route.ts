import { NextResponse } from 'next/server';

export async function GET() {
  const protocols = [
    {
      id: "electricity",
      category: "electrical",
      titleEn: "Electrical Short Circuit Control",
      titleHi: "बिजली शॉर्ट सर्किट नियंत्रण",
      icon: "Zap",
      stepsEn: [
        "Locate the Main Circuit Breaker (MCB) or fuse box immediately.",
        "Turn off the main electrical switch to cut power to the whole building.",
        "Do not throw water on electrical fires; use a Class C fire extinguisher if safe.",
        "Disconnect all expensive electronic appliances to prevent damage from power surges.",
        "Keep clear of metallic objects, wet floors, and exposed wires."
      ],
      stepsHi: [
        "मुख्य सर्किट ब्रेकर (MCB) या फ़्यूज़ बॉक्स का तुरंत पता लगाएं।",
        "पूरे भवन में बिजली काटने के लिए मुख्य बिजली स्विच बंद करें।",
        "बिजली की आग पर पानी न फेंकें; सुरक्षित होने पर क्लास सी अग्निशामक का उपयोग करें।",
        "पावर सर्ज से होने वाले नुकसान से बचने के लिए सभी महंगे इलेक्ट्रॉनिक उपकरणों को डिस्कनेक्ट करें।",
        "धातु की वस्तुओं, गीले फर्शों और खुले तारों से दूर रहें।"
      ],
      severity: "high"
    },
    {
      id: "gas",
      category: "gas",
      titleEn: "Gas Leakage Evacuation & Isolation",
      titleHi: "गैस रिसाव निकासी और अलगाव",
      icon: "Flame",
      stepsEn: [
        "Immediately turn off the main gas cylinder valve or supply valve.",
        "Open all windows and doors wide to disperse the gas build-up.",
        "Strictly avoid electrical switches, matchsticks, lighters, or cell phones in the leak area.",
        "Evacuate all occupants and pets out of the building to a safe distance.",
        "Call the emergency gas helpline once you are at a safe outdoor location."
      ],
      stepsHi: [
        "तुरंत मुख्य गैस सिलेंडर वाल्व या आपूर्ति वाल्व को बंद करें।",
        "गैस के जमाव को दूर करने के लिए सभी खिड़कियां और दरवाजे खोल दें।",
        "रिसाव क्षेत्र में बिजली के स्विच, माचिस, लाइटर या सेल फोन के उपयोग से पूरी तरह बचें।",
        "भवन से सभी निवासियों और पालतू जानवरों को सुरक्षित दूरी पर बाहर निकालें।",
        "सुरक्षित बाहरी स्थान पर पहुंचने के बाद आपातकालीन गैस हेल्पलाइन पर कॉल करें।"
      ],
      severity: "critical"
    },
    {
      id: "water",
      category: "plumbing",
      titleEn: "Burst Pipe / Major Flooding",
      titleHi: "पाइप फटना / भीषण बाढ़",
      icon: "Droplet",
      stepsEn: [
        "Locate the main water shut-off valve (usually near the water meter or boundary wall).",
        "Turn the valve clockwise to stop the incoming municipal or tank water supply.",
        "If water is near electrical outlets or appliances, shut down the main power breaker immediately.",
        "Move high-value assets, electronics, and documents to a higher floor or dry area.",
        "Open lower faucets to drain the residual water still trapped inside plumbing lines."
      ],
      stepsHi: [
        "मुख्य जल बंद वाल्व का पता लगाएं (आमतौर पर पानी के मीटर या सीमा दीवार के पास)।",
        "आने वाले नगर पालिका या टैंक जल आपूर्ति को रोकने के लिए वाल्व को दक्षिणावर्त (क्लाकवाइज) घुमाएं।",
        "यदि पानी बिजली के आउटलेट या उपकरणों के पास है, तो तुरंत मुख्य बिजली ब्रेकर बंद कर दें।",
        "उच्च मूल्य वाली संपत्तियों, इलेक्ट्रॉनिक्स और दस्तावेजों को ऊपरी मंजिल या सूखे क्षेत्र में ले जाएं।",
        "प्लंबिंग लाइनों के अंदर अभी भी फंसे हुए अवशिष्ट पानी को निकालने के लिए निचले नल खोलें।"
      ],
      severity: "medium"
    },
    {
      id: "provider-verification",
      category: "general",
      titleEn: "Expert Identity & Security Check",
      titleHi: "विशेषज्ञ पहचान और सुरक्षा जांच",
      icon: "ShieldCheck",
      stepsEn: [
        "Verify the professional's face and profile picture against the app dispatch screen.",
        "Ask the professional to display their LocalFix digital identification or Aadhaar status.",
        "Ensure they share the secure 4-digit Emergency OTP dispatched to your phone.",
        "Do not allow the professional to perform unbooked repairs or work outside the official app.",
        "Ensure children and vulnerable residents are not left unattended during the repair visit."
      ],
      stepsHi: [
        "ऐप डिस्पैच स्क्रीन के साथ पेशेवर के चेहरे और प्रोफ़ाइल चित्र का मिलान करें।",
        "पेशेवर को अपना लोकलफिक्स डिजिटल पहचान पत्र या आधार स्थिति दिखाने के लिए कहें।",
        "सुनिश्चित करें कि वे आपके फोन पर भेजे गए सुरक्षित 4-अंकीय आपातकालीन ओटीपी को साझा करें।",
        "पेशेवर को बिना बुकिंग की मरम्मत करने या आधिकारिक ऐप के बाहर काम करने की अनुमति न दें।",
        "सुनिश्चित करें कि मरम्मत यात्रा के दौरान बच्चों और संवेदनशील निवासियों को अकेला न छोड़ा जाए।"
      ],
      severity: "high"
    }
  ];

  return NextResponse.json({ success: true, protocols });
}
