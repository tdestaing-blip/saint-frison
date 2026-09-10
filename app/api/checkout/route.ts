export async function POST() {
  return Response.json(
    {
      error: "Les acquisitions se font directement auprès du studio.",
      contactUrl: "/contact?type=Luminaire%20%2F%20acquisition",
    },
    { status: 410, headers: { "Cache-Control": "no-store" } },
  );
}
