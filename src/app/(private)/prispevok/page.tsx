// /src/app/(private)/prispevok/page.tsx

import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/authOptions";
import { prisma } from "@/app/api/auth/[...nextauth]/prisma"; // Use PrismaClient instance
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";

export const metadata = { title: "Príspevky | SnapZoška" };

export default async function FeedPage() {
  const session = await getServerSession(authOptions);

  // Fetch posts from the database, including user details
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: true }, // Fetch related user data
  });

  return (
    <Container>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Príspevky
      </Typography>
      {posts.length > 0 ? (
        posts.map((post) => (
          <Card key={post.id} sx={{ mb: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", p: 2 }}>
              <Avatar
                alt={post.user.name || "User"}
                src={post.user.image || ""}
                sx={{ mr: 2 }}
              />
              <Typography variant="subtitle1">{post.user.name}</Typography>
            </Box>
            <CardMedia
              component="img"
              height="300"
              image={post.imageUrl}
              alt={post.caption || "Post image"}
            />
            <CardContent>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {post.caption || "Bez popisu"}
              </Typography>
              <Typography
                variant="body2"
                color="textSecondary"
                sx={{ fontSize: "0.8rem" }}
              >
                Publikované: {new Date(post.createdAt).toLocaleString("sk-SK")}
              </Typography>
            </CardContent>
          </Card>
        ))
      ) : (
        <Typography variant="body1">Žiadne príspevky na zobrazenie.</Typography>
      )}
    </Container>
  );
}
