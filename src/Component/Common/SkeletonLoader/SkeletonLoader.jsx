import { Box, Skeleton, useMediaQuery, useTheme } from "@mui/material";

const SkeletonLoader = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f3f4f6" }}>
      {/* Sidebar — hidden on mobile */}
      {!isMobile && (
        <Box
          sx={{
            width: { sm: 200, md: 220 },
            minHeight: "100vh",
            bgcolor: "white",
            borderRight: "1px solid #e5e7eb",
            p: 2,
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
            flexShrink: 0,
          }}
        >
          {/* Logo */}
          <Skeleton variant="rounded" width="80%" height={36} sx={{ mb: 2 }} />

          {/* Nav items */}
          <Skeleton variant="rounded" width="90%" height={18} />
          <Skeleton variant="rounded" width="75%" height={18} />
          <Skeleton variant="rounded" width="85%" height={18} />
          <Skeleton variant="rounded" width="60%" height={18} />
          <Skeleton variant="rounded" width="80%" height={18} />

          {/* Bottom nav item */}
          <Box sx={{ mt: "auto" }}>
            <Skeleton variant="rounded" width="70%" height={18} />
          </Box>
        </Box>
      )}

      {/* Main Content */}
      <Box
        sx={{
          flex: 1,
          p: { xs: 2, sm: 2.5, md: 3 },
          display: "flex",
          flexDirection: "column",
          gap: 2.5,
        }}
      >
        {/* Mobile: logo placeholder at top */}
        {isMobile && (
          <Skeleton variant="rounded" width="50%" height={32} sx={{ mb: 1 }} />
        )}

        {/* Top stat cards — stacks to 1 col on mobile, 3 on desktop */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
            },
            gap: 1.5,
          }}
        >
          <Skeleton variant="rounded" height={80} sx={{ borderRadius: 2 }} />
          <Skeleton variant="rounded" height={80} sx={{ borderRadius: 2 }} />
          <Skeleton
            variant="rounded"
            height={80}
            sx={{ borderRadius: 2, display: { xs: "none", sm: "block" } }}
          />
        </Box>

        {/* Chart area */}
        <Skeleton
          variant="rounded"
          height={{ xs: 160, sm: 180, md: 200 }}
          sx={{ borderRadius: 2 }}
        />

        {/* List rows */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.2 }}>
          <Skeleton variant="rounded" width="30%" height={16} />
          <Skeleton variant="rounded" height={44} sx={{ borderRadius: 2 }} />
          <Skeleton variant="rounded" height={44} sx={{ borderRadius: 2 }} />
          <Skeleton variant="rounded" height={44} sx={{ borderRadius: 2 }} />
        </Box>
      </Box>
    </Box>
  );
};

export default SkeletonLoader;
