const {onDocumentCreated} = require("firebase-functions/v2/firestore");

const admin = require("firebase-admin");
admin.initializeApp();

const BAD_WORDS = [
  "mierda", "puta", "hijo de puta", "tu puta madre", "carajo", "joder",
  "coño", "cabron", "imbecil", "idiota", "gilipollas", "bastardo",
  "maldito", "zorra",
  "pendejo", "pinche", "chingar", "chingado", "chingados", "chingón",
  "verga", "huevón", "no mames",
  "boludo", "pelotudo", "forro", "conchetumare", "culiao", "concha de tu madre",
  "maricon", "joto", "maraco",
  "que te jodan", "vete a la mierda", "me cago en la puta",
  "me cago en tus muertos",
  "la hostia", "me cago en la leche", "me cago en todo lo que se menea",
  "cojones", "pañico", "tonto del culo", "come mierda", "lame culo",
  "chupapijas", "chupamela", "traga leche", "chupahuevos",
];
/**
 * @param {text} text
 * @return {any}
 */
function censorText(text) {
  let censored = text;
  BAD_WORDS.forEach((word) => {
    const regex = new RegExp(`\\b${word}\\b`, "gi");
    censored = censored.replace(regex, "[REDACTED]");
  });
  return censored;
}

exports.censorPostOnCreate = onDocumentCreated("Posts/{postId}",
    async (event) => {
      const snapshot = event.data;
      if (!snapshot) return;

      const original = snapshot.data();
      const content = original.text || "";

      const censoredContent = censorText(content);

      if (censoredContent !== content) {
        await snapshot.ref.update({text: censoredContent});
      }

      return null;
    });
