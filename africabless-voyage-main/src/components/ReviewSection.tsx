import { useState, useEffect } from "react";
import { Star, User, Calendar, ThumbsUp, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";
import { getTripReviews, submitReview, getAgencyReviewStats } from "@/lib/api";
import { Review, ReviewStats } from "@/schemas";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface ReviewSectionProps {
  tripId: string;
  agencyId: string;
  agencyName: string;
}

const ReviewSection = ({ tripId, agencyId, agencyName }: ReviewSectionProps) => {
  const { isLoggedIn, token } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewStats, setReviewStats] = useState<ReviewStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviewsAndStats = async () => {
      try {
        setLoading(true);
        const [fetchedReviews, fetchedStats] = await Promise.all([
          getTripReviews(tripId),
          getAgencyReviewStats(agencyId)
        ]);
        setReviews(fetchedReviews);
        setReviewStats(fetchedStats);
      } catch (err) {
        console.error("Error fetching reviews and stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviewsAndStats();
  }, [tripId, agencyId]);

  const handleSubmitReview = async () => {
    if (!isLoggedIn) {
      setError("Vous devez être connecté pour soumettre un avis.");
      return;
    }

    if (rating === 0) {
      setError("Veuillez sélectionner une note.");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      
      const reviewData = {
        trip_id: tripId,
        rating,
        comment: comment || undefined,
        agency_id: agencyId
      };

      const newReview = await submitReview(reviewData, token!);
      setReviews(prev => [newReview, ...prev]);
      setSuccess("Votre avis a été soumis avec succès !");
      setRating(0);
      setComment("");
      
      // Refresh stats
      const updatedStats = await getAgencyReviewStats(agencyId);
      setReviewStats(updatedStats);
    } catch (err) {
      setError("Erreur lors de la soumission de l'avis. Veuillez réessayer.");
      console.error("Error submitting review:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Avis sur ${agencyName}`,
        text: `Découvrez les avis sur ${agencyName} sur bitTravel`,
        url: window.location.href,
      }).catch((error) => console.log('Erreur lors du partage', error));
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href).then(() => {
        setSuccess("Lien copié dans le presse-papiers !");
      }).catch(() => {
        setError("Impossible de copier le lien. Veuillez le copier manuellement.");
      });
    }
  };

  if (loading) {
    return <div className="text-center py-8">Chargement des avis...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Review Stats */}
      {reviewStats && (
        <div className="bg-card p-6 rounded-xl shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold">Avis sur {agencyName}</h3>
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-2" />
              Partager
            </Button>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold">{reviewStats.average_rating.toFixed(1)}</div>
              <div className="flex items-center justify-center gap-1 mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(reviewStats.average_rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground"
                    }`}
                  />
                ))}
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                {reviewStats.total_reviews} avis
              </div>
            </div>
            
            <div className="flex-1 space-y-2">
              {[5, 4, 3, 2, 1].map((star) => (
                <div key={star} className="flex items-center gap-2">
                  <span className="text-sm w-4">{star}</span>
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400"
                      style={{
                        width: `${reviewStats.total_reviews > 0 ? (reviewStats.rating_distribution[star as keyof typeof reviewStats.rating_distribution] / reviewStats.total_reviews) * 100 : 0}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm w-8 text-right">
                    {reviewStats.total_reviews > 0 
                      ? Math.round((reviewStats.rating_distribution[star as keyof typeof reviewStats.rating_distribution] / reviewStats.total_reviews) * 100)
                      : 0}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Submit Review */}
      {isLoggedIn && (
        <div className="bg-card p-6 rounded-xl shadow-card">
          <h3 className="text-xl font-bold mb-4">Donnez votre avis</h3>
          
          {error && (
            <div className="bg-destructive/10 text-destructive p-3 rounded-lg mb-4">
              {error}
            </div>
          )}
          
          {success && (
            <div className="bg-green-500/10 text-green-500 p-3 rounded-lg mb-4">
              {success}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Note globale
              </label>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setRating(i + 1)}
                    onMouseEnter={() => setHoverRating(i + 1)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="focus:outline-none"
                    aria-label={`Donner ${i + 1} étoiles`}
                  >
                    <Star
                      className={`h-8 w-8 ${
                        i < (hoverRating || rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-muted-foreground"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label htmlFor="comment" className="block text-sm font-medium mb-2">
                Commentaire (optionnel)
              </label>
              <Textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Partagez votre expérience..."
                rows={4}
                maxLength={500}
              />
              <div className="text-right text-sm text-muted-foreground mt-1">
                {comment.length}/500
              </div>
            </div>
            
            <Button
              onClick={handleSubmitReview}
              disabled={submitting}
              className="bg-gradient-hero hover:opacity-90"
            >
              {submitting ? "Envoi en cours..." : "Soumettre l'avis"}
            </Button>
          </div>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold">
          Avis des voyageurs ({reviews.length})
        </h3>
        
        {reviews.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Aucun avis pour le moment. Soyez le premier à partager votre expérience !
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="bg-card p-6 rounded-xl shadow-card">
                <div className="flex items-start gap-4">
                  <div className="bg-muted rounded-full p-3">
                    <User className="h-6 w-6" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-muted-foreground"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-medium">
                        {review.rating}/5
                      </span>
                    </div>
                    
                    {review.comment && (
                      <p className="text-muted-foreground mb-3">
                        {review.comment}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {format(new Date(review.created_at), "dd MMMM yyyy", { locale: fr })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewSection;