import React from 'react';
import { findLimits } from '../../../utils/findLimits';

const Boost = ({ data, accountPlan: propAccountPlan, purchaseDate: propPurchaseDate }) => {
  const safeData = data || {};
  const accountPlan = propAccountPlan ?? safeData?.accountPlan ?? 1;
  const purchaseDate = propPurchaseDate ?? safeData?.purchaseDate;

  const limits = findLimits(accountPlan);

  const calculateLimitData = (used, total) => {
    const percentage = total > 0 ? Math.min(100, Math.round((used / total) * 100)) : 0;
    return { total, used, percentage };
  };

  const safeCalculate = (total, available) => {
    const used = available !== undefined && available !== null ? total - available : 0;
    return calculateLimitData(Math.max(0, Math.min(used, total)), total);
  };

  const textLimitData = safeCalculate(limits.total_text_limit, safeData?.text_limit ?? limits.total_text_limit);
  const imageLimitData = safeCalculate(limits.total_image_limit, safeData?.image_limit ?? limits.total_image_limit);
  const fileLimitData = safeCalculate(limits.total_file_limit, safeData?.file_limit ?? limits.total_file_limit);

  const proDetails = {
    name: "Pro",
    textLimit: 1000,
    imageLimit: 100,
    fileLimit: 20,
    textCharacterLimit: 10000,
    imageSizeLimit: "20MB",
    fileSizeLimit: "50MB",
    features: ["24/7 support"],
    price: "$9.99/month"
  };

  const premiumDetails = {
    name: "Premium",
    textLimit: 2000,
    imageLimit: 500,
    fileLimit: 100,
    textCharacterLimit: 20000,
    imageSizeLimit: "50MB",
    fileSizeLimit: "100MB",
    features: ["24/7 support", "AI assistant (coming soon)"],
    price: "$19.99/month"
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const calculateExpiryDate = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp);
    date.setFullYear(date.getFullYear() + 1);
    return formatDate(date.getTime());
  };

  const UsageChart = ({ data }) => {
    const getColorClass = (percentage) => {
      if (percentage >= 90) return 'bg-red-500';
      if (percentage >= 75) return 'bg-orange-500';
      if (percentage >= 50) return 'bg-yellow-500';
      return 'bg-green-500';
    };

    return (
      <div className="w-full">
        <div className="flex justify-between text-sm mb-1">
          <span>{data.used} used</span>
          <span className={`font-medium ${data.percentage >= 90 ? 'text-red-600' : data.percentage >= 75 ? 'text-orange-600' : ''}`}>
            {data.total} total
          </span>
        </div>
        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
          <div className={`h-full ${getColorClass(data.percentage)} transition-all duration-300`} style={{ width: `${data.percentage}%` }}></div>
        </div>
        {data.percentage >= 90 && (
          <p className="text-xs text-red-600 mt-1">⚠️ Approaching limit! Consider upgrading your plan.</p>
        )}
      </div>
    );
  };

  const PlanCard = ({ plan, isCurrentPlan }) => (
    <div
      role="article"
      aria-label={`${plan.name} plan`}
      className={`relative p-6 rounded-xl border transition-transform duration-200 ease-in-out hover:shadow-lg focus-within:scale-[1.01] ${
        isCurrentPlan ? 'border-blue-500 bg-linear-to-br from-white to-blue-50' : 'border-gray-200 bg-white'
      }`}
    >
      {isCurrentPlan ? (
        <div className="absolute -top-3 left-4 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">Current</div>
      ) : plan.name === 'Premium' ? (
        <div className="absolute -top-3 left-4 bg-amber-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">Recommended</div>
      ) : null}

      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-linear-to-br from-slate-50 to-slate-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 1.343-3 3v6h6v-6c0-1.657-1.343-3-3-3z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11v6a2 2 0 01-2 2H7a2 2 0 01-2-2v-6" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800">{plan.name}</h3>
            <p className="text-sm text-slate-500">{plan.features.slice(0, 2).join(' • ')}</p>
          </div>
        </div>

        <div className="text-right">
          <div className="text-sm text-slate-500">Starting at</div>
          <div className="text-xl font-extrabold text-slate-800">{plan.price}</div>
        </div>
      </div>

      <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-700">
        <div><strong>Text:</strong> {plan.textLimit}</div>
        <div><strong>Images:</strong> {plan.imageLimit}</div>
        <div><strong>Files:</strong> {plan.fileLimit}</div>
        <div><strong>Chars:</strong> {plan.textCharacterLimit}</div>
        <div><strong>Img size:</strong> {plan.imageSizeLimit}</div>
        <div><strong>File size:</strong> {plan.fileSizeLimit}</div>
      </div>

      <div className="mb-4">
        <h4 className="font-semibold mb-2 text-slate-800">What's included</h4>
        <ul className="space-y-2 text-sm text-slate-700">
          {plan.features.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-emerald-500 mt-[0.5]" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 10-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z" clipRule="evenodd" />
              </svg>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4">
        {!isCurrentPlan ? (
          <button
            aria-label={`Upgrade to ${plan.name}`}
            className="w-full inline-flex items-center justify-center gap-2 bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Upgrade to {plan.name}
          </button>
        ) : (
          <p className="text-center text-sm text-slate-600">You're on the {plan.name} plan — enjoy your benefits!</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4 text-slate-800">Plan & Usage</h2>

        {accountPlan > 1 && purchaseDate && (
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-8">
            <h3 className="text-lg font-semibold mb-2">Your Subscription</h3>
            <p><strong>Plan:</strong> {accountPlan === 2 ? 'Pro' : 'Premium'}</p>
            <p><strong>Purchase Date:</strong> {formatDate(purchaseDate)}</p>
            <p><strong>Expires On:</strong> {calculateExpiryDate(purchaseDate)}</p>
          </div>
        )}

        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Your Usage</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div role="region" aria-label="Text usage" className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-indigo-50 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
                    </svg>
                  </div>
                  <h4 className="font-medium">Text Clips</h4>
                </div>
                <span className={`text-sm font-medium ${textLimitData.percentage >= 90 ? 'text-red-600' : textLimitData.percentage >= 75 ? 'text-orange-600' : textLimitData.percentage >= 50 ? 'text-yellow-600' : 'text-green-600'}`}>{textLimitData.percentage}%</span>
              </div>
              <UsageChart data={textLimitData} />
              <p className="mt-3 text-xs text-slate-500">{textLimitData.used}/{textLimitData.total} used</p>
            </div>

            <div role="region" aria-label="Image usage" className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-pink-50 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 3v4M16 3v4" />
                    </svg>
                  </div>
                  <h4 className="font-medium">Image Clips</h4>
                </div>
                <span className={`text-sm font-medium ${imageLimitData.percentage >= 90 ? 'text-red-600' : imageLimitData.percentage >= 75 ? 'text-orange-600' : imageLimitData.percentage >= 50 ? 'text-yellow-600' : 'text-green-600'}`}>{imageLimitData.percentage}%</span>
              </div>
              <UsageChart data={imageLimitData} />
              <p className="mt-3 text-xs text-slate-500">{imageLimitData.used}/{imageLimitData.total} used • Max {limits.total_image_limit}</p>
            </div>

            <div role="region" aria-label="File usage" className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7v10a2 2 0 002 2h6a2 2 0 002-2V7" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7V5a2 2 0 012-2h6a2 2 0 012 2v2" />
                    </svg>
                  </div>
                  <h4 className="font-medium">File Clips</h4>
                </div>
                <span className={`text-sm font-medium ${fileLimitData.percentage >= 90 ? 'text-red-600' : fileLimitData.percentage >= 75 ? 'text-orange-600' : fileLimitData.percentage >= 50 ? 'text-yellow-600' : 'text-green-600'}`}>{fileLimitData.percentage}%</span>
              </div>
              <UsageChart data={fileLimitData} />
              <p className="mt-3 text-xs text-slate-500">{fileLimitData.used}/{fileLimitData.total} used</p>
            </div>
          </div>
        </div>

        {accountPlan === 1 ? (
          <div>
            <h3 className="text-lg font-semibold mb-4">Upgrade Your Plan</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <PlanCard plan={proDetails} isCurrentPlan={false} />
              <PlanCard plan={premiumDetails} isCurrentPlan={false} />
            </div>
          </div>
        ) : (
          <div>
            <h3 className="text-lg font-semibold mb-4">Your Plan</h3>
            <PlanCard plan={accountPlan === 2 ? proDetails : premiumDetails} isCurrentPlan={true} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Boost;

