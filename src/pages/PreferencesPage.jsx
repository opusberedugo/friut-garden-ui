import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CategoryPicker from "../components/forms/CategoryPicker"
import Flex from "../components/layout/Flex";
import Form from "../components/forms/Form";
import FormLabel from "../components/forms/FormLabel";
import Toggle from "../components/forms/Toggle";
import Slider from "../components/forms/Slider";
import MultiSelect from "../components/forms/MultiSelect";
import FormButton from "../components/forms/Button";
import Toast from "../components/feedback/Toast";
import Alert from "../components/feedback/Alert";
import AppNavBar from "../components/navigation/AppNavbar";
import Grid from "../components/layout/Grid";
import SideBar from "../components/navigation/SideBar";
import SideBarLink from "../components/navigation/SideBarLink";
import SidebarDivider from "../components/navigation/SidebarDivider";

export default function PreferencesPage() {
  const navigate = useNavigate();
  const apiURL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ open: false, message: '', variant: 'success' });
  const [alertState, setAlertState] = useState({ open: false, variant: 'info', title: '', message: '' })

  const [organicOnly, setOrganicOnly] = useState(false)
  const [budget, setBudget] = useState(0)
  const [minBudget, setMinBudget] = useState(0)
  const [maxBudget, setMaxBudget] = useState(0)
  const [seasons, setSeasons] = useState([])
  const [selectedSeasons, setSelectedSeasons] = useState([])
  const [categories, setCategories] = useState([])
  const [favoriteCategories, setFavoriteCategories] = useState([])
  const [excludedCategories, setExcludedCategories] = useState([])

  const [originalSnapshot, setOriginalSnapshot] = useState("");
  const [isDirty, setIsDirty] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  function showAlert(variant, title, message) {
    setAlertState({ open: true, variant, title, message })
  }

  function hideAlert() {
    setAlertState(prev => ({ ...prev, open: false }))
  }

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('fm_token');
      if (token) {
        await fetch(`${apiURL}/logout`, { method: "POST", headers: { 'Authorization': `Bearer ${token}` } });
      }
    } catch (e) { console.error(e); }
    localStorage.removeItem('fm_token');
    window.location.href = "/login";
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const token = localStorage.getItem('fm_token');
        if (!token) { navigate('/login'); return; }

        const [catRes, seasonRes, minMaxRes, prefRes] = await Promise.all([
          fetch(`${apiURL}/get-categories`),
          fetch(`${apiURL}/get-seasons`),
          fetch(`${apiURL}/get-min-max-cost`),
          fetch(`${apiURL}/get-user-preferences`, { headers: { 'Authorization': `Bearer ${token}` } })
        ]);

        if (catRes.ok) {
          const catData = await catRes.json();
          setCategories(catData);
        }
        if (seasonRes.ok) {
          const seasonData = await seasonRes.json();
          setSeasons(seasonData);
        }
        if (minMaxRes.ok) {
          const mData = await minMaxRes.json();
          setMinBudget(mData.min);
          setMaxBudget(mData.max);
        }
        if (prefRes.ok) {
          const prefData = await prefRes.json();
          if (prefData) {
            setFavoriteCategories(prefData.favoriteCategories || []);
            setExcludedCategories(prefData.excludedCategories || []);
            setOrganicOnly(prefData.organicOnly || false);
            setBudget(prefData.budget || 0);
            setSelectedSeasons(prefData.selectedSeasons || []);

            setOriginalSnapshot(JSON.stringify({
              favoriteCategories: prefData.favoriteCategories || [],
              excludedCategories: prefData.excludedCategories || [],
              organicOnly: prefData.organicOnly || false,
              budget: prefData.budget || 0,
              selectedSeasons: prefData.selectedSeasons || []
            }));
          }
        }
      } catch (err) {
        console.error(err);
        setToast({ open: true, message: 'Failed to load preferences.', variant: 'error' });
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [apiURL, navigate]);

  useEffect(() => {
    const currentSnapshot = JSON.stringify({
      favoriteCategories,
      excludedCategories,
      organicOnly,
      budget,
      selectedSeasons
    });
    setIsDirty(currentSnapshot !== originalSnapshot);
  }, [favoriteCategories, excludedCategories, organicOnly, budget, selectedSeasons, originalSnapshot]);

  async function handleSavePreferences(e) {
    e.preventDefault()

    if (favoriteCategories.length < 5) {
      showAlert('error', 'Incomplete Preferences', 'Please select at least 5 favorite categories.')
      return
    }

    if (selectedSeasons.length < 3) {
      showAlert('error', 'Incomplete Preferences', 'Please select at least 3 seasonal item preferences.')
      return
    }

    let finalBudget = budget;
    if (finalBudget === 0 || finalBudget < minBudget) {
      finalBudget = minBudget;
      setBudget(minBudget);
    }

    setIsSubmitting(true);

    try {
      const payload = {
        favoriteCategories,
        excludedCategories,
        organicOnly,
        budget: finalBudget,
        selectedSeasons
      }

      const token = localStorage.getItem('fm_token');
      const response = await fetch(`${apiURL}/update-user-preferences`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        setOriginalSnapshot(JSON.stringify(payload));
        setIsDirty(false);
        setToast({ open: true, message: 'Preferences updated successfully!', variant: 'success' });
      } else {
        setToast({ open: true, message: 'Failed to update preferences.', variant: 'error' });
      }
    } catch (err) {
      console.error(err)
      setToast({ open: true, message: 'Failed to update preferences.', variant: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-gray-500 font-medium">Loading preferences...</p>
      </div>
    );
  }

  return(
    <>
      <Toast open={toast.open} message={toast.message} variant={toast.variant} onClose={() => setToast({ ...toast, open: false })} />
      <AppNavBar />
      <Grid className="grid-cols-1 md:grid-cols-5 ">
        <SideBar className="col-span-1">
          <SideBarLink className="text-forest-600 bg-transparent hover:bg-transparent hover:text-lime-400" text="Cart" href="/profile" >Cart</SideBarLink>
          <SideBarLink className="text-forest-600 bg-transparent hover:bg-transparent hover:text-lime-400" text="Wishlist" href="/profile/wishlist" >Wishlist</SideBarLink>
          <SideBarLink className="text-forest-600 bg-transparent hover:bg-transparent hover:text-lime-400" text="Preferences" href="/profile/preferences" >Preferences</SideBarLink>
          <SideBarLink className="text-forest-600 bg-transparent hover:bg-transparent hover:text-lime-400" text="Orders" href="/profile/orders" >Orders</SideBarLink>
          <SidebarDivider/>
          <SideBarLink className="text-forest-600 bg-transparent hover:bg-transparent hover:text-lime-400" text="Sales Dashboard" href="/profile/sales/dashboard" >Sales Dashboard</SideBarLink>
          <SideBarLink className="text-forest-600 bg-transparent hover:bg-transparent hover:text-lime-400" text="Products" href="/profile/sales/products" >My Products</SideBarLink>
          <SideBarLink className="text-forest-600 bg-transparent hover:bg-transparent hover:text-lime-400" text="Orders" href="/profile/sales/orders" >My Orders</SideBarLink>
          <SideBarLink className="text-forest-600 bg-transparent hover:bg-transparent hover:text-lime-400" text="Reviews" href="/profile/sales/reviews" >My Reviews</SideBarLink>
          <SidebarDivider/>
          <SideBarLink className="text-forest-600 bg-transparent hover:bg-transparent hover:text-lime-400" text="Profile" href="/profile" >Profile Settings</SideBarLink>
          <SideBarLink className="text-forest-600 bg-transparent hover:bg-transparent hover:text-lime-400" text="Settings" href="/settings" >Account Settings</SideBarLink>
          <SideBarLink className="text-red-500 bg-transparent hover:bg-transparent hover:text-red-600" text="Log Out" onClick={handleLogout} >Log Out</SideBarLink>
        </SideBar>

        {/* Preferences Content */}
        <Grid className="col-span-1 md:col-span-4 w-full px-4 md:px-12 mt-12 min-h-screen pt-8 pb-32">
          <div className="max-w-4xl">
            <h2 className="text-[28px] font-bold text-gray-900 mb-8">My Preferences</h2>

            <div className="w-full flex-shrink-0 px-4 md:px-20">
              <div className="mb-8">
                <h1 className="text-2xl font-semibold text-gray-900 mb-2">User Preferences</h1>
                <p className="text-gray-600">Tell us a bit about yourself to personalise your experience.</p>

                <Alert 
                  open={alertState.open} 
                  variant={alertState.variant} 
                  title={alertState.title} 
                  message={alertState.message} 
                  onClose={hideAlert} 
                />

                <Form className="mt-4" onSubmit={handleSavePreferences}>
                  <CategoryPicker
                    label="Your Category Preferences"
                    categories={categories}
                    favorites={favoriteCategories}
                    exclusions={excludedCategories}
                    onFavoritesChange={setFavoriteCategories}
                    onExclusionsChange={setExcludedCategories}
                  />

                  <Flex className={"w-full flex items-center justify-between"}>
                    <FormLabel name="organicOnly" label="I want to see organic products only" />
                    <Toggle
                      name="organicOnly"
                      checked={organicOnly}
                      onChange={(e) => setOrganicOnly(e.target.checked)}
                    />
                  </Flex>

                  <Slider
                    name="budget"
                    label="Max Budget"
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    min={minBudget}
                    max={maxBudget}
                    shadow={false}
                    step={0.01}
                    unit=" MUR"
                    leftText={minBudget}
                    rightText={`MUR ${maxBudget}`}
                  />

                  <MultiSelect
                    label="Select your prefered Seasonal Items"
                    options={seasons.map((season) => ({ value: season, label: season }))}
                    value={selectedSeasons}
                    onChange={setSelectedSeasons}
                    placeholder="Select options"
                  />

                  <FormButton 
                    className="bg-forest-500 hover:bg-forest-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed disabled:text-gray-500" 
                    text={isSubmitting ? "Saving Preferences..." : "Save Preferences"} 
                    disabled={!isDirty || isSubmitting} 
                  />
                </Form>
              </div>
            </div>
          </div>
        </Grid>
      </Grid>
    </>
  )
}