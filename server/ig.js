import axios from "axios";
import { ig } from "./config.js";

async function auth() {
  return (
    await axios.post(`${ig}auth/authenticate`, {
      key: process.env.IK,
      secret: process.env.IS,
    })
  ).data.token;
}

export async function digiPrint() {
  let data = {
    fullName: "Who Wan Tan",
    gender: "male",
    dateOfBirth: "03 Nov 1986",
    email: "whowantan@gmail.com",
    phoneCode: "65",
    phoneNumber: "98899889",
  };
  try {
    return (
      await axios.post(`${ig}digital-footprint`, data, {
        headers: { Authorization: `Bearer ${await auth()}` },
      })
    ).data;
  } catch (error) {
    return error.response.data;
  }
}

export async function getIframe(ad) {
  let data = {
    clientId: ad,
    age: 45,
    gender: "male",
    showResults: "display",
    noDesign: false,
    faceOutline: true,
    buttonBgColor: "#000000",
    buttonTextColor: "#ffffff",
    isVoiceAnalysisOn: false,
    voiceAnalysisType: "",
    forceFrontCamera: true,
    // diabetesHypertensionParameters: {
    //   height: 168,
    //   weight: 63,
    //   smoker: false,
    //   hypertension: false,
    //   bpMedication: false,
    //   diabetic: 0,
    //   waistCircumference: 29,
    //   heartDisease: false,
    //   depression: false,
    //   totalCholesterol: 200,
    //   hdl: 50,
    //   parentalHypertension: 0,
    //   physicalActivity: true,
    //   healthyDiet: true,
    //   antiHypertensive: false,
    //   historyBloodGlucose: false,
    //   historyFamilyDiabetes: 0,
    // },
    language: "en",
    showDisclaimer: "false",
  };
  try {
    return (
      await axios.post(`${ig}face-scan/generate-video-token`, data, {
        headers: { Authorization: `Bearer ${await auth()}` },
      })
    ).data.videoIframeUrl;
  } catch (error) {
    return error.response.data;
  }
}
