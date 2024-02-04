const nats = [
  "AU",
  "CA",
  "FR",
  "IN",
  "IR",
  "MX",
  "NL",
  "NO",
  "NZ",
  "RS",
  "TR",
  "US",
];

interface NameParams {
  gender?: "male" | "female";
  nat?: (typeof nats)[number];
}

export const getRandomName = async (params: NameParams) => {
  let nat = params.nat && !nats.includes(params.nat.toUpperCase())
    ? nats[Math.floor(Math.random() * nats.length)]
    : params.nat ?? "";

  console.log("getRandomName");
  try {
    const response = await fetch(`https://randomuser.me/api/?nat=${nat}`, {
      method: "GET",
    });
    const data = await response.json();
    const name = data.results[0].name;
    // console.log("results", params, name);
    return {
      result: name.first + " " + name.last,
    };
  } catch (err) {
    throw new Error("Error fetching random name");
  }
};
