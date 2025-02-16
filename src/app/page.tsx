import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import HomeNavigation from '@/components/home/HomeNavigation';
import AnimatedSection from '@/components/home/AnimatedSection';
import AllPlaysSection from '@/components/home/AllPlaysSection';

export default async function Home() {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });
  
  const { data: plays = [] } = await supabase
    .from('plays')
    .select('*')
    .order('created_at', { ascending: false });

  // Ensure plays is an array
  const playsArray = plays || [];

  // Organize plays into categories
  const today = new Date();

  const upcomingPlays = playsArray
    .filter(play => new Date(play.date) > today)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const recentPlays = playsArray
    .filter(play => new Date(play.date) <= today)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 6);

  const unratedPlays = playsArray
    .filter(play => 
      new Date(play.date) <= today && 
      !play.rating
    );

  const hallOfFamePlays = playsArray
    .filter(play => 
      play.rating && 
      (parseInt(play.rating) === 5 || play.isStandingOvation)
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const hallOfShamePlays = playsArray
    .filter(play => 
      play.rating && 
      parseInt(play.rating) <= 2
    )
    .sort((a, b) => {
      const ratingDiff = parseInt(a.rating) - parseInt(b.rating);
      if (ratingDiff !== 0) return ratingDiff;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

  return (
    <>
      <HomeNavigation />
      
      <div className="max-w-7xl mx-auto px-4 space-y-24 pb-24">
        {upcomingPlays.length > 0 && (
          <AnimatedSection 
            id="upcoming"
            title="Upcoming Shows"
            plays={upcomingPlays}
            showCalendarToggle
          />
        )}

        {recentPlays.length > 0 && (
          <AnimatedSection 
            id="recent"
            title="Recently Seen"
            plays={recentPlays}
          />
        )}

        {unratedPlays.length > 0 && (
          <AnimatedSection 
            id="unrated"
            title="Unrated Plays"
            plays={unratedPlays}
          />
        )}

        <AnimatedSection 
          id="hall"
          title="Hall of Fame"
          plays={hallOfFamePlays}
          alternateTitle="Hall of Shame"
          alternatePlays={hallOfShamePlays}
        />

        <AllPlaysSection 
          id="all"
          title="All Plays"
          plays={playsArray}
        />

        {playsArray.length === 0 && (
          <div className="pt-24 text-center">
            <h2 className="text-2xl font-medium text-gray-600 dark:text-gray-400">
              No plays found. Add some plays to get started!
            </h2>
          </div>
        )}
      </div>
    </>
  );
}
