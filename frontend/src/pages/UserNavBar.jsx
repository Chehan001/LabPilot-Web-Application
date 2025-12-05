import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  FlaskConical,
  CheckCircle,
  BarChart3,
  ChevronRight,
  Menu,
  X,
  LogOut,
} from "lucide-react";

export default function UserNavBar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeItem, setActiveItem] = useState(location.pathname);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const sidebarRef = useRef();

  useEffect(() => {
    setActiveItem(location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024);
      if (window.innerWidth > 1024) {
        setIsOpen(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!isMobile) {
      const handleMouseMove = (e) => {
        if (e.clientX < 40) {
          setIsOpen(true);
        }
      };
      window.addEventListener("mousemove", handleMouseMove);
      return () => window.removeEventListener("mousemove", handleMouseMove);
    }
  }, [isMobile]);

  useEffect(() => {
    if (isMobile && isOpen) {
      const handleClickOutside = (e) => {
        if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
          setIsOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isMobile, isOpen]);

  const navItems = [
    { label: "Home", path: "/home", icon: Home },
    { label: "Practicals", path: "/userpracticals", icon: FlaskConical },
    { label: "Attendance", path: "/userattendance", icon: CheckCircle },
    { label: "Reports", path: "/userreports", icon: BarChart3 },
  ];

  const expandedWidth = 280;
  const collapsedWidth = 60;

  const styles = {
    sidebar: {
      width: isOpen ? expandedWidth + "px" : collapsedWidth + "px",
      transition: "width 0.35s ease",
      height: "100vh",
      background: "linear-gradient(180deg, #89ace6ff 0%, #0f172a 100%)",
      color: "white",
      padding: "24px 16px",
      position: "fixed",
      left: isOpen || !isMobile ? 0 : "-100%",
      top: 0,
      display: "flex",
      flexDirection: "column",
      boxShadow: isMobile
        ? "4px 0 20px rgba(0,0,0,0.5)"
        : "4px 0 20px rgba(0,0,0,0.3)",
      zIndex: 1000,
      overflow: "hidden",
    },
    topBar: {
      display: isMobile ? "flex" : "none",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "12px 16px",
      color: "white",
      position: "fixed",
      top: 0,
      right: -15,
      zIndex: 1001,
    },
    nav: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      gap: "8px",
    },
    navButton: (isActive) => ({
      width: "100%",
      display: "flex",
      alignItems: "center",
      gap: "12px",
      padding: "14px 16px",
      borderRadius: "15px",
      border: "none",
      cursor: "pointer",
      transition: "all 0.3s ease",
      background: isActive
        ? "linear-gradient(135deg, #253b9fff 0%, #71a9eeff 100%)"
        : "transparent",
      transform: isActive ? "translateX(4px)" : "translateX(0)",
      boxShadow: isActive ? "0 4px 12px rgba(6, 33, 155, 0.3)" : "none",
      whiteSpace: "nowrap",
      overflow: "hidden",
    }),
    label: (isActive) => ({
      fontWeight: isActive ? "600" : "500",
      fontSize: "15px",
      flex: 1,
      textAlign: "left",
      color: isActive ? "white" : "rgba(255,255,255,0.85)",
      opacity: isOpen ? 1 : 0,
      transition: "opacity .3s ease",
    }),
    iconWrapper: (isActive) => ({
      display: "flex",
      color: isActive ? "white" : "rgba(255,255,255,0.7)",
      transition: "color 0.3s ease",
      zIndex: 10,
    }),
    footer: {
      paddingTop: "24px",
      borderTop: "1px solid rgba(255,255,255,0.1)",
      opacity: isOpen ? 1 : 0,
      transition: "opacity .3s ease",
    },
    footerText: {
      fontSize: "12px",
      color: "rgba(255,255,255,0.5)",
      textAlign: "center",
      margin: 0,
    },

    logoutBtn: {
      width: "100%",
      marginTop: "12px",
      padding: "12px 16px",
      borderRadius: "12px",
      border: "none",
      background: "rgba(255, 255, 255, 0.12)",
      display: "flex",
      alignItems: "center",
      gap: "12px",
      cursor: "pointer",
      color: "white",
      transition: "all 0.3s ease",
      opacity: isOpen ? 1 : 0,
    },
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("admin");
    navigate("/login");
  };

  return (
    <>
      {isMobile && (
        <div style={styles.topBar}>
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      )}

      <div
        ref={sidebarRef}
        style={styles.sidebar}
        onMouseLeave={() => !isMobile && setIsOpen(false)}
      >
        <nav style={styles.nav}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.path;

            return (
              <button
                key={item.path}
                onClick={() => {
                  setActiveItem(item.path);
                  navigate(item.path);
                }}
                style={styles.navButton(isActive)}
              >
                <div style={styles.iconWrapper(isActive)}>
                  <Icon size={20} />
                </div>
                <span style={styles.label(isActive)}>{item.label}</span>
                {isActive && (
                  <ChevronRight
                    size={18}
                    style={{ color: "white", opacity: isOpen ? 1 : 0 }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Logout Button  */}
        <button style={styles.logoutBtn} onClick={handleLogout}>
          <LogOut size={20} />
          <span style={{ opacity: isOpen ? 1 : 0 }}>Logout</span>
        </button>

        <div style={styles.footer}>
          <p style={styles.footerText}>© 2024 Student Portal</p>
        </div>
      </div>
    </>
  );
}
