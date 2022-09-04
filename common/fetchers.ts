export const saveSession = async (dehydratedState: string) => {
  try {
    await fetch("/api/session/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dehydratedState }),
    });
  } catch (e) {
    console.error(e);
  }
};

export const destroySession = async () => {
  try {
    await fetch("/api/session/destroy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: null,
    });
  } catch (e) {
    console.error(e);
  }
};
